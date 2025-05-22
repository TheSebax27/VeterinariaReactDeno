import { conexion } from "./conexion.ts";
import { z } from "../Routes/Dependencies/dependencias.ts";

interface PropietarioData {
    id_propietario: number | null;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string | null;
    direccion: string | null;
    fecha_registro?: string;
}

export class Propietario {
    public _objPropietario: PropietarioData | null;
    public _idPropietario: number | null;

    constructor(objPropietario: PropietarioData | null = null, idPropietario: number | null = null) {
        this._objPropietario = objPropietario;
        this._idPropietario = idPropietario;
    }

    public async seleccionarPropietarios(): Promise<PropietarioData[]> {
        const { rows: propietarios } = await conexion.execute("SELECT * FROM propietarios");
        return propietarios as PropietarioData[];
    }

    public async seleccionarPropietarioPorId(): Promise<PropietarioData | null> {
        if (!this._idPropietario) {
            throw new Error("No se ha proporcionado un ID de propietario válido");
        }

        const { rows: propietarios } = await conexion.execute(
            "SELECT * FROM propietarios WHERE id_propietario = ?",
            [this._idPropietario]
        );

        if (propietarios.length === 0) {
            return null;
        }

        return propietarios[0] as PropietarioData;
    }

    public async insertarPropietario(): Promise<{ success: boolean; message: string; propietario?: Record<string, unknown> }> {
        try {
            if (!this._objPropietario) {
                throw new Error("No se ha proporcionado un objeto de propietario válido");
            }

            const { nombre, apellidos, telefono, email, direccion } = this._objPropietario;
            if (!nombre || !apellidos || !telefono) {
                throw new Error("Faltan campos requeridos para insertar el propietario");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `INSERT INTO propietarios (nombre, apellidos, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)`,
                [nombre, apellidos, telefono, email, direccion]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [propietario] = await conexion.query(
                    `SELECT * FROM propietarios WHERE id_propietario = LAST_INSERT_ID()`
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Propietario registrado correctamente.",
                    propietario: propietario,
                };
            } else {
                throw new Error("No fue posible registrar el propietario.");
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

    public async actualizarPropietario(): Promise<{ success: boolean; message: string; propietario?: Record<string, unknown> }> {
        try {
            if (!this._objPropietario || !this._idPropietario) {
                throw new Error("No se ha proporcionado un objeto/ID de propietario válido");
            }

            const { nombre, apellidos, telefono, email, direccion } = this._objPropietario;
            if (!nombre || !apellidos || !telefono) {
                throw new Error("Faltan campos requeridos para actualizar el propietario");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `UPDATE propietarios SET nombre = ?, apellidos = ?, telefono = ?, email = ?, direccion = ? WHERE id_propietario = ?`,
                [nombre, apellidos, telefono, email, direccion, this._idPropietario]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [propietario] = await conexion.query(
                    `SELECT * FROM propietarios WHERE id_propietario = ?`,
                    [this._idPropietario]
                );

                await conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Propietario actualizado correctamente.",
                    propietario: propietario,
                };
            } else {
                throw new Error("No fue posible actualizar el propietario o no se encontró.");
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

    public async eliminarPropietario(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._idPropietario) {
                throw new Error("No se ha proporcionado un ID de propietario válido");
            }

            // Verificar si el propietario tiene mascotas
            const { rows: mascotas } = await conexion.execute(
                "SELECT COUNT(*) as count FROM mascotas WHERE id_propietario = ?",
                [this._idPropietario]
            );

            if (mascotas[0].count > 0) {
                return {
                    success: false,
                    message: "No se puede eliminar el propietario porque tiene mascotas registradas",
                };
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `DELETE FROM propietarios WHERE id_propietario = ?`,
                [this._idPropietario]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                await conexion.execute("COMMIT");
                return { success: true, message: "Propietario eliminado correctamente." };
            } else {
                throw new Error("No fue posible eliminar el propietario o no se encontró.");
            }
        } catch (error) {
            await conexion.execute("ROLLBACK");
            return { success: false, message: error.message || "Error interno del servidor" };
        }
    }
}