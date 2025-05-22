import { conexion } from "./conexion.ts";

interface EspecieData {
    id_especie: number | null;
    nombre: string;
    descripcion: string | null;
}

export class Especie {
    public _objEspecie: EspecieData | null;
    public _idEspecie: number | null;

    constructor(objEspecie: EspecieData | null = null, idEspecie: number | null = null) {
        this._objEspecie = objEspecie;
        this._idEspecie = idEspecie;
    }

    public async seleccionarEspecies(): Promise<EspecieData[]> {
        const { rows: especies } = await conexion.execute("SELECT * FROM especies");
        return especies as EspecieData[];
    }

    public async seleccionarEspeciePorId(): Promise<EspecieData | null> {
        if (!this._idEspecie) {
            throw new Error("No se ha proporcionado un ID de especie válido");
        }

        const { rows: especies } = await conexion.execute(
            "SELECT * FROM especies WHERE id_especie = ?",
            [this._idEspecie]
        );

        if (especies.length === 0) {
            return null;
        }

        return especies[0] as EspecieData;
    }
}