import { conexion } from "./conexion.ts";
import { z } from "../Routes/Dependencies/dependencias.ts";

interface CitaData {
    id_cita: number | null;
    id_mascota: number;
    id_veterinario: number;
    fecha_hora: string;
    motivo: string;
    estado?: 'Programada' | 'Completada' | 'Cancelada' | 'No asistió';
    notas?: string | null;
}

export class Cita {
    public _objCita: CitaData | null;
    public _idCita: number | null;

    constructor(objCita: CitaData | null = null, idCita: number | null = null) {
        this._objCita = objCita;
        this._idCita = idCita;
    }

    public async seleccionarCitas(): Promise<CitaData[]> {
        const { rows: citas } = await conexion.execute(`
            SELECT c.*, m.nombre as nombre_mascota, p.nombre as nombre_propietario, p.apellidos as apellidos_propietario,
                   v.nombre as nombre_veterinario, v.apellidos as apellidos_veterinario
            FROM citas c
            JOIN mascotas m ON c.id_mascota = m.id_mascota
            JOIN propietarios p ON m.id_propietario = p.id_propietario
            JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
            ORDER BY c.fecha_hora
        `);
        return citas as CitaData[];
    }

    public async seleccionarCitasPorFecha(fecha: string): Promise<CitaData[]> {
        const { rows: citas } = await conexion.execute(`
            SELECT c.*, m.nombre as nombre_mascota, p.nombre as nombre_propietario, p.apellidos as apellidos_propietario,
                   v.nombre as nombre_veterinario, v.apellidos as apellidos_veterinario
            FROM citas c
            JOIN mascotas m ON c.id_mascota = m.id_mascota
            JOIN propietarios p ON m.id_propietario = p.id_propietario
            JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
            WHERE DATE(c.fecha_hora) = ?
            ORDER BY c.fecha_hora
        `, [fecha]);
        return citas as CitaData[];
    }

    public async seleccionarCitasPorMascota(idMascota: number): Promise<CitaData[]> {
        const { rows: citas } = await conexion.execute(`
            SELECT c.*, v.nombre as nombre_veterinario, v.apellidos as apellidos_veterinario
            FROM citas c
            JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
            WHERE c.id_mascota = ?
            ORDER BY c.fecha_hora DESC
        `, [idMascota]);
        return citas as CitaData[];
    }

    public async seleccionarCitasPorVeterinario(idVeterinario: number): Promise<CitaData[]> {
        const { rows: citas } = await conexion.execute(`
            SELECT c.*, m.nombre as nombre_mascota, p.nombre as nombre_propietario, p.apellidos as apellidos_propietario
            FROM citas c
            JOIN mascotas m ON c.id_mascota = m.id_mascota
            JOIN propietarios p ON m.id_propietario = p.id_propietario
            WHERE c.id_veterinario = ?
            ORDER BY c.fecha_hora
        `, [idVeterinario]);
        return citas as CitaData[];
    }

    public async insertarCita(): Promise<{ success: boolean; message: string; cita?: Record<string, unknown> }> {
        try {
            if (!this._objCita) {
                throw new Error("No se ha proporcionado un objeto de cita válido");
            }

            const { id_mascota, id_veterinario, fecha_hora, motivo } = this._objCita;
            if (!id_mascota || !id_veterinario || !fecha_hora || !motivo) {
                throw new Error("Faltan campos requeridos para insertar la cita");
            }

            // Verificar si la fecha y hora ya están ocupadas para ese veterinario
            const { rows: citasExistentes } = await conexion.execute(`
                SELECT COUNT(*) as count FROM citas 
                WHERE id_veterinario = ? AND fecha_hora = ? AND estado != 'Cancelada'
            `, [id_veterinario, fecha_hora]);

            if (citasExistentes[0].count > 0) {
                return {
                    success: false,
                    message: "Ya existe una cita programada para este veterinario en la fecha y hora seleccionadas.",
                };
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`
                INSERT INTO citas (id_mascota, id_veterinario, fecha_hora, motivo, estado, notas)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                id_mascota,
                id_veterinario,
                fecha_hora,
                motivo,
                this._objCita.estado || 'Programada',
                this._objCita.notas
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [cita] = await conexion.query(
                    `SELECT * FROM citas WHERE id_cita = LAST_INSERT_ID()`
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Cita registrada correctamente.",
                    cita: cita,
                };
            } else {
                throw new Error("No fue posible registrar la cita.");
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");

            if (error instanceof z.ZodError) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: error.message || "Error interno del servidor" };
            }
        }
    }

    public async actualizarEstadoCita(): Promise<{ success: boolean; message: string; cita?: Record<string, unknown> }> {
        try {
            if (!this._idCita || !this._objCita) {
                throw new Error("No se ha proporcionado un ID de cita o estado válido");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`
                UPDATE citas SET estado = ?, notas = ? WHERE id_cita = ?
            `, [
                this._objCita.estado,
                this._objCita.notas,
                this._idCita
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [cita] = await conexion.query(
                    `SELECT * FROM citas WHERE id_cita = ?`,
                    [this._idCita]
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Estado de la cita actualizado correctamente.",
                    cita: cita,
                };
            } else {
                throw new Error("No fue posible actualizar el estado de la cita o no se encontró.");
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: error.message || "Error interno del servidor" };
        }
    }

    public async eliminarCita(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._idCita) {
                throw new Error("No se ha proporcionado un ID de cita válido");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `DELETE FROM citas WHERE id_cita = ?`,
                [this._idCita]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                return { success: true, message: "Cita eliminada correctamente." };
            } else {
                throw new Error("No fue posible eliminar la cita o no se encontró.");
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: error.message || "Error interno del servidor" };
        }
    }
}