import { Mascota } from "../Models/mascotaModel.ts";

export const getMascotas = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objMascota = new Mascota();
        const listaMascotas = await objMascota.seleccionarMascotas();
        response.status = 200;
        response.body = { success: true, data: listaMascotas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getMascotasPorPropietario = async (ctx: any) => {
    const { params, response } = ctx;
    const idPropietario = params.idPropietario;

    if (!idPropietario) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID de propietario" };
        return;
    }

    try {
        const objMascota = new Mascota({ 
            id_mascota: null,
            id_propietario: parseInt(idPropietario),
            id_especie: 0,
            id_raza: null,
            nombre: "",
            fecha_nacimiento: null,
            sexo: "Macho",
            color: null,
            peso: null
        });
        const listaMascotas = await objMascota.seleccionarMascotasPorPropietario();
        response.status = 200;
        response.body = { success: true, data: listaMascotas };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getMascotaPorId = async (ctx: any) => {
    const { params, response } = ctx;
    const id = params.id;

    if (!id) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID para buscar la mascota" };
        return;
    }

    try {
        const objMascota = new Mascota(null, parseInt(id));
        const mascota = await objMascota.seleccionarMascotaPorId();
        
        if (!mascota) {
            response.status = 404;
            response.body = { success: false, msg: "Mascota no encontrada" };
            return;
        }

        response.status = 200;
        response.body = { success: true, data: mascota };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const postMascotas = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        const mascotaData = {
            id_mascota: null,
            id_propietario: body.id_propietario,
            id_especie: body.id_especie,
            id_raza: body.id_raza || null,
            nombre: body.nombre,
            fecha_nacimiento: body.fecha_nacimiento || null,
            sexo: body.sexo,
            color: body.color || null,
            peso: body.peso || null
        };

        const objMascota = new Mascota(mascotaData);
        const result = await objMascota.insertarMascota();

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

export const putMascotas = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_mascota) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID de la mascota para actualizar" };
            return;
        }

        const mascotaData = {
            id_mascota: body.id_mascota,
            id_propietario: body.id_propietario,
            id_especie: body.id_especie,
            id_raza: body.id_raza || null,
            nombre: body.nombre,
            fecha_nacimiento: body.fecha_nacimiento || null,
            sexo: body.sexo,
            color: body.color || null,
            peso: body.peso || null,
            activo: body.activo !== undefined ? body.activo : true
        };

        const objMascota = new Mascota(mascotaData, body.id_mascota);
        const result = await objMascota.actualizarMascota();

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

export const deleteMascotas = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_mascota) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID de la mascota para eliminar" };
            return;
        }

        const objMascota = new Mascota(null, body.id_mascota);
        const result = await objMascota.eliminarMascota();

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