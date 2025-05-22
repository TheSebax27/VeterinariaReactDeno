import { conexion } from "./conexion.ts";
import { z } from "../Routes/Dependencies/dependencias.ts";

interface VeterinarioData {
    id_veterinario: number | null;
    nombre: string;
    apellidos: string;
    especialidad: string | null;
    telefono: string | null;
    email: string | null;
    numero_licencia: string | null;
    activo?: boolean;
}

export class Veterinario {
    public _objVeterinario: VeterinarioData | null;
    public _idVeterinario: number | null;

    constructor(objVeterinario: VeterinarioData | null = null, idVeterinario: number | null = null) {
        this._objVeterinario = objVeterinario;
        this._idVeterinario = idVeterinario;
    }

    public async seleccionarVeterinarios(): Promise<VeterinarioData[]> {
        const { rows: veterinarios } = await conexion.execute("SELECT * FROM veterinarios");
        return veterinarios as VeterinarioData[];
    }

    public async seleccionarVeterinariosPorEstado(activo: boolean): Promise<VeterinarioData[]> {
        const { rows: veterinarios } = await conexion.execute(
            "SELECT * FROM veterinarios WHERE activo = ?",
            [activo]
        );
        return veterinarios as VeterinarioData[];
    }

    public async seleccionarVeterinarioPorId(): Promise<VeterinarioData | null> {
        if (!this._idVeterinario) {
            throw new Error("No se ha proporcionado un ID de veterinario válido");
        }

        const { rows: veterinarios } = await conexion.execute(
            "SELECT * FROM veterinarios WHERE id_veterinario = ?",
            [this._idVeterinario]
        );

        if (veterinarios.length === 0) {
            return null;
        }

        return veterinarios[0] as VeterinarioData;
    }

    public async insertarVeterinario(): Promise<{ success: boolean; message: string; veterinario?: Record<string, unknown> }> {
        try {
            if (!this._objVeterinario) {
                throw new Error("No se ha proporcionado un objeto de veterinario válido");
            }

            const { nombre, apellidos } = this._objVeterinario;
            if (!nombre || !apellidos) {
                throw new Error("Faltan campos requeridos para insertar el veterinario");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`
                INSERT INTO veterinarios (nombre, apellidos, especialidad, telefono, email, numero_licencia, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                nombre,
                apellidos,
                this._objVeterinario.especialidad,
                this._objVeterinario.telefono,
                this._objVeterinario.email,
                this._objVeterinario.numero_licencia,
                this._objVeterinario.activo !== undefined ? this._objVeterinario.activo : true
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [veterinario] = await conexion.query(
                    `SELECT * FROM veterinarios WHERE id_veterinario = LAST_INSERT_ID()`
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Veterinario registrado correctamente.",
                    veterinario: veterinario,
                };
            } else {
                throw new Error("No fue posible registrar el veterinario.");
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

    public async actualizarVeterinario(): Promise<{ success: boolean; message: string; veterinario?: Record<string, unknown> }> {
        try {
            if (!this._objVeterinario || !this._idVeterinario) {
                throw new Error("No se ha proporcionado un objeto/ID de veterinario válido");
            }

            const { nombre, apellidos } = this._objVeterinario;
            if (!nombre || !apellidos) {
                throw new Error("Faltan campos requeridos para actualizar el veterinario");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`
                UPDATE veterinarios 
                SET nombre = ?, apellidos = ?, especialidad = ?, telefono = ?, 
                    email = ?, numero_licencia = ?, activo = ?
                WHERE id_veterinario = ?
            `, [
                nombre,
                apellidos,
                this._objVeterinario.especialidad,
                this._objVeterinario.telefono,
                this._objVeterinario.email,
                this._objVeterinario.numero_licencia,
                this._objVeterinario.activo !== undefined ? this._objVeterinario.activo : true,
                this._idVeterinario
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [veterinario] = await conexion.query(
                    `SELECT * FROM veterinarios WHERE id_veterinario = ?`,
                    [this._idVeterinario]
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Veterinario actualizado correctamente.",
                    veterinario: veterinario,
                };
            } else {
                throw new Error("No fue posible actualizar el veterinario o no se encontró.");
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
}