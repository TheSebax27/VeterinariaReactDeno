import { conexion } from "./conexion.ts";
import { z } from "../Routes/Dependencies/dependencias.ts";

interface MascotaData {
    id_mascota: number | null;
    id_propietario: number;
    id_especie: number;
    id_raza: number | null;
    nombre: string;
    fecha_nacimiento: string | null;
    sexo: 'Macho' | 'Hembra';
    color: string | null;
    peso: number | null;
    fecha_registro?: string;
    activo?: boolean;
}

export class Mascota {
    public _objMascota: MascotaData | null;
    public _idMascota: number | null;

    constructor(objMascota: MascotaData | null = null, idMascota: number | null = null) {
        this._objMascota = objMascota;
        this._idMascota = idMascota;
    }

    public async seleccionarMascotas(): Promise<MascotaData[]> {
        const { rows: mascotas } = await conexion.execute(`
            SELECT m.*, p.nombre as nombre_propietario, p.apellidos as apellidos_propietario, 
                   e.nombre as nombre_especie, r.nombre as nombre_raza
            FROM mascotas m
            LEFT JOIN propietarios p ON m.id_propietario = p.id_propietario
            LEFT JOIN especies e ON m.id_especie = e.id_especie
            LEFT JOIN razas r ON m.id_raza = r.id_raza
        `);
        return mascotas as MascotaData[];
    }

    public async seleccionarMascotasPorPropietario(): Promise<MascotaData[]> {
        if (!this._objMascota?.id_propietario) {
            throw new Error("No se ha proporcionado un ID de propietario válido");
        }

        const { rows: mascotas } = await conexion.execute(`
            SELECT m.*, e.nombre as nombre_especie, r.nombre as nombre_raza
            FROM mascotas m
            LEFT JOIN especies e ON m.id_especie = e.id_especie
            LEFT JOIN razas r ON m.id_raza = r.id_raza
            WHERE m.id_propietario = ?
        `, [this._objMascota.id_propietario]);

        return mascotas as MascotaData[];
    }

    public async seleccionarMascotaPorId(): Promise<MascotaData | null> {
        if (!this._idMascota) {
            throw new Error("No se ha proporcionado un ID de mascota válido");
        }

        const { rows: mascotas } = await conexion.execute(`
            SELECT m.*, p.nombre as nombre_propietario, p.apellidos as apellidos_propietario, 
                   e.nombre as nombre_especie, r.nombre as nombre_raza
            FROM mascotas m
            LEFT JOIN propietarios p ON m.id_propietario = p.id_propietario
            LEFT JOIN especies e ON m.id_especie = e.id_especie
            LEFT JOIN razas r ON m.id_raza = r.id_raza
            WHERE m.id_mascota = ?
        `, [this._idMascota]);

        if (mascotas.length === 0) {
            return null;
        }

        return mascotas[0] as MascotaData;
    }

    public async insertarMascota(): Promise<{ success: boolean; message: string; mascota?: Record<string, unknown> }> {
        try {
            if (!this._objMascota) {
                throw new Error("No se ha proporcionado un objeto de mascota válido");
            }

            const { id_propietario, id_especie, nombre, sexo } = this._objMascota;
            if (!id_propietario || !id_especie || !nombre || !sexo) {
                throw new Error("Faltan campos requeridos para insertar la mascota");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`
                INSERT INTO mascotas (id_propietario, id_especie, id_raza, nombre, fecha_nacimiento, sexo, color, peso)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                id_propietario,
                id_especie,
                this._objMascota.id_raza,
                nombre,
                this._objMascota.fecha_nacimiento,
                sexo,
                this._objMascota.color,
                this._objMascota.peso
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [mascota] = await conexion.query(
                    `SELECT * FROM mascotas WHERE id_mascota = LAST_INSERT_ID()`
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Mascota registrada correctamente.",
                    mascota: mascota,
                };
            } else {
                throw new Error("No fue posible registrar la mascota.");
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

    public async actualizarMascota(): Promise<{ success: boolean; message: string; mascota?: Record<string, unknown> }> {
        try {
            if (!this._objMascota || !this._idMascota) {
                throw new Error("No se ha proporcionado un objeto/ID de mascota válido");
            }

            const { id_propietario, id_especie, nombre, sexo } = this._objMascota;
            if (!id_propietario || !id_especie || !nombre || !sexo) {
                throw new Error("Faltan campos requeridos para actualizar la mascota");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(`
                UPDATE mascotas 
                SET id_propietario = ?, id_especie = ?, id_raza = ?, nombre = ?, 
                    fecha_nacimiento = ?, sexo = ?, color = ?, peso = ?, activo = ?
                WHERE id_mascota = ?
            `, [
                id_propietario,
                id_especie,
                this._objMascota.id_raza,
                nombre,
                this._objMascota.fecha_nacimiento,
                sexo,
                this._objMascota.color,
                this._objMascota.peso,
                this._objMascota.activo !== undefined ? this._objMascota.activo : true,
                this._idMascota
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [mascota] = await conexion.query(
                    `SELECT * FROM mascotas WHERE id_mascota = ?`,
                    [this._idMascota]
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Mascota actualizada correctamente.",
                    mascota: mascota,
                };
            } else {
                throw new Error("No fue posible actualizar la mascota o no se encontró.");
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

    public async eliminarMascota(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._idMascota) {
                throw new Error("No se ha proporcionado un ID de mascota válido");
            }

            // Verificar si la mascota tiene citas o historiales
            const { rows: citas } = await conexion.execute(
                "SELECT COUNT(*) as count FROM citas WHERE id_mascota = ?",
                [this._idMascota]
            );

            const { rows: historiales } = await conexion.execute(
                "SELECT COUNT(*) as count FROM historiales WHERE id_mascota = ?",
                [this._idMascota]
            );

            if (citas[0].count > 0 || historiales[0].count > 0) {
                return {
                    success: false,
                    message: "No se puede eliminar la mascota porque tiene citas o historiales asociados",
                };
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `DELETE FROM mascotas WHERE id_mascota = ?`,
                [this._idMascota]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                return { success: true, message: "Mascota eliminada correctamente." };
            } else {
                throw new Error("No fue posible eliminar la mascota o no se encontró.");
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: error.message || "Error interno del servidor" };
        }
    }
}