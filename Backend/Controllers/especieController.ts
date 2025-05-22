import { Especie } from "../Models/especieModel.ts";

export const getEspecies = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objEspecie = new Especie();
        const listaEspecies = await objEspecie.seleccionarEspecies();
        response.status = 200;
        response.body = { success: true, data: listaEspecies };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

// ===========================================================================
// Controllers/razaController.ts
import { Raza } from "../Models/razaModel.ts";

export const getRazas = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objRaza = new Raza();
        const listaRazas = await objRaza.seleccionarRazas();
        response.status = 200;
        response.body = { success: true, data: listaRazas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getRazasPorEspecie = async (ctx: any) => {
    const { params, response } = ctx;
    const idEspecie = params.idEspecie;

    if (!idEspecie) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID de especie" };
        return;
    }

    try {
        const objRaza = new Raza(null, null, parseInt(idEspecie));
        const listaRazas = await objRaza.seleccionarRazasPorEspecie();
        response.status = 200;
        response.body = { success: true, data: listaRazas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};