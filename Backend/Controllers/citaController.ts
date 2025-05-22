import { Cita } from "../Models/citaModel.ts";

export const getCitas = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objCita = new Cita();
        const listaCitas = await objCita.seleccionarCitas();
        response.status = 200;
        response.body = { success: true, data: listaCitas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getCitasPorFecha = async (ctx: any) => {
    const { params, response } = ctx;
    const fecha = params.fecha;

    if (!fecha) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere una fecha (formato: YYYY-MM-DD)" };
        return;
    }

    try {
        const objCita = new Cita();
        const listaCitas = await objCita.seleccionarCitasPorFecha(fecha);
        response.status = 200;
        response.body = { success: true, data: listaCitas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getCitasPorMascota = async (ctx: any) => {
    const { params, response } = ctx;
    const idMascota = params.idMascota;

    if (!idMascota) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID de mascota" };
        return;
    }

    try {
        const objCita = new Cita();
        const listaCitas = await objCita.seleccionarCitasPorMascota(parseInt(idMascota));
        response.status = 200;
        response.body = { success: true, data: listaCitas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getCitasPorVeterinario = async (ctx: any) => {
    const { params, response } = ctx;
    const idVeterinario = params.idVeterinario;

    if (!idVeterinario) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID de veterinario" };
        return;
    }

    try {
        const objCita = new Cita();
        const listaCitas = await objCita.seleccionarCitasPorVeterinario(parseInt(idVeterinario));
        response.status = 200;
        response.body = { success: true, data: listaCitas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const postCitas = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        const citaData = {
            id_cita: null,
            id_mascota: body.id_mascota,
            id_veterinario: body.id_veterinario,
            fecha_hora: body.fecha_hora,
            motivo: body.motivo,
            estado: body.estado || 'Programada',
            notas: body.notas || null
        };

        const objCita = new Cita(citaData);
        const result = await objCita.insertarCita();

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

export const putEstadoCita = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_cita || !body.estado) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID de la cita y el nuevo estado" };
            return;
        }

        const citaData = {
            id_cita: body.id_cita,
            id_mascota: 0, // No se usa en actualizarEstadoCita
            id_veterinario: 0, // No se usa en actualizarEstadoCita
            fecha_hora: "", // No se usa en actualizarEstadoCita
            motivo: "", // No se usa en actualizarEstadoCita
            estado: body.estado,
            notas: body.notas || null
        };

        const objCita = new Cita(citaData, body.id_cita);
        const result = await objCita.actualizarEstadoCita();

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

export const deleteCitas = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_cita) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID de la cita para eliminar" };
            return;
        }

        const objCita = new Cita(null, body.id_cita);
        const result = await objCita.eliminarCita();

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