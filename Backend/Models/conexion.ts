import { Client } from "../Routes/Dependencies/dependencias.ts";

export const conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "veterinaria",
    password: "12345",
});