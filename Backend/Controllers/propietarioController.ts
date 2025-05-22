import { Propietario } from "../Models/propietarioModel.ts";

export const getPropietarios = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objPropietario = new Propietario();
        const listaPropietarios = await objPropietario.seleccionarPropietarios();
        response.status = 200;
        response.body = { success: true, data: listaPropietarios };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const getPropietarioPorId = async (ctx: any) => {
    const { params, response } = ctx;
    const id = params.id;

    if (!id) {
        response.status = 400;
        response.body = { success: false, msg: "Se requiere un ID para buscar el propietario" };
        return;
    }

    try {
        const objPropietario = new Propietario(null, parseInt(id));
        const propietario = await objPropietario.seleccionarPropietarioPorId();
        
        if (!propietario) {
            response.status = 404;
            response.body = { success: false, msg: "Propietario no encontrado" };
            return;
        }

        response.status = 200;
        response.body = { success: true, data: propietario };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud", errors: error };
    }
};

export const postPropietarios = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        const propietarioData = {
            id_propietario: null,
            nombre: body.nombre,
            apellidos: body.apellidos,
            telefono: body.telefono,
            email: body.email || null,
            direccion: body.direccion || null
        };

        const objPropietario = new Propietario(propietarioData);
        const result = await objPropietario.insertarPropietario();

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

export const putPropietarios = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_propietario) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID del propietario para actualizar" };
            return;
        }

        const propietarioData = {
            id_propietario: body.id_propietario,
            nombre: body.nombre,
            apellidos: body.apellidos,
            telefono: body.telefono,
            email: body.email || null,
            direccion: body.direccion || null
        };

        const objPropietario = new Propietario(propietarioData, body.id_propietario);
        const result = await objPropietario.actualizarPropietario();

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

export const deletePropietarios = async (ctx: any) => {
    const { request, response } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "El cuerpo de la solicitud no puede estar vacío" };
            return;
        }

        const body = await request.body.json();
        if (!body.id_propietario) {
            response.status = 400;
            response.body = { success: false, msg: "Se requiere el ID del propietario para eliminar" };
            return;
        }

        const objPropietario = new Propietario(null, body.id_propietario);
        const result = await objPropietario.eliminarPropietario();

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