import { conexion } from "./conexion.ts";

interface RazaData {
    id_raza: number | null;
    id_especie: number;
    nombre: string;
    descripcion: string | null;
}

export class Raza {
    public _objRaza: RazaData | null;
    public _idRaza: number | null;
    public _idEspecie: number | null;

    constructor(objRaza: RazaData | null = null, idRaza: number | null = null, idEspecie: number | null = null) {
        this._objRaza = objRaza;
        this._idRaza = idRaza;
        this._idEspecie = idEspecie;
    }

    public async seleccionarRazas(): Promise<RazaData[]> {
        const { rows: razas } = await conexion.execute(`
            SELECT r.*, e.nombre as nombre_especie
            FROM razas r
            JOIN especies e ON r.id_especie = e.id_especie
        `);
        return razas as RazaData[];
    }

    public async seleccionarRazasPorEspecie(): Promise<RazaData[]> {
        if (!this._idEspecie) {
            throw new Error("No se ha proporcionado un ID de especie válido");
        }

        const { rows: razas } = await conexion.execute(
            "SELECT * FROM razas WHERE id_especie = ?",
            [this._idEspecie]
        );

        return razas as RazaData[];
    }
}