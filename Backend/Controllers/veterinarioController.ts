import { Veterinario } from "../Models/veterinarioModel.ts";

export const getVeterinarios = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objVeterinario = new Veterinario();
        const listaVeterinarios = await objVeterinario.seleccionarVeterinarios();
        response.status = 200;
        response.body = { success: true, data: listaVeterinarios };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getVeterinariosPorEstado = async (ctx: any) => {
    const { params, response } = ctx;
    const activo = params.activo === "true"; // Convertir a booleano

    try {
        const objVeterinario = new Veterinario();
        const listaVeterinarios = await objVeterinario.seleccionarVeterinariosPorEstado(activo);
        response.status = 200;
        response.body = { success: true, data: listaVeterinarios };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getVeterinarioPorId = async (ctx: any) => {
    const { params, response } = ctx;
    const id = params.id;

    if (!id) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID para buscar al veterinario" };
        return;
    }

    try {
        const objVeterinario = new Veterinario(null, parseInt(id));
        const veterinario = await objVeterinario.seleccionarVeterinarioPorId();
        
        if (!veterinario) {
            response.status = 404;
            response.body = { success: false, msg: "Veterinario no encontrado" };
            return;
        }

        response.status = 200;
        response.body = { success: true, data: veterinario };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const postVeterinarios = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        const veterinarioData = {
            id_veterinario: null,
            nombre: body.nombre,
            apellidos: body.apellidos,
            especialidad: body.especialidad || null,
            telefono: body.telefono || null,
            email: body.email || null,
            numero_licencia: body.numero_licencia || null,
            activo: body.activo !== undefined ? body.activo : true
        };

        const objVeterinario = new Veterinario(veterinarioData);
        const result = await objVeterinario.insertarVeterinario();

        if (result.success) {
            response.status = 201;  // Created
        } else {
            response.status = 400;  // Bad Request
        }
        response.body = result;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const putVeterinarios = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_veterinario) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID del veterinario para actualizar" };
            return;
        }

        const veterinarioData = {
            id_veterinario: body.id_veterinario,
            nombre: body.nombre,
            apellidos: body.apellidos,
            especialidad: body.especialidad || null,
            telefono: body.telefono || null,
            email: body.email || null,
            numero_licencia: body.numero_licencia || null,
            activo: body.activo !== undefined ? body.activo : true
        };

        const objVeterinario = new Veterinario(veterinarioData, body.id_veterinario);
        const result = await objVeterinario.actualizarVeterinario();

        if (result.success) {
            response.status = 200;  // OK
        } else {
            response.status = 400;  // Bad Request
        }
        response.body = result;
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};