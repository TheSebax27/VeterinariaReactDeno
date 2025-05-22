import { Application, oakCors } from "./Routes/Dependencies/dependencias.ts";
import { propietarioRouter } from "./Routes/propietarioRouter.ts";
import { mascotaRouter } from "./Routes/mascotaRouter.ts";
import { especieRouter } from "./Routes/especieRouter.ts";
import { razaRouter } from "./Routes/razaRouter.ts";
import { veterinarioRouter } from "./Routes/veterinarioRouter.ts";
import { citaRouter } from "./Routes/citaRouter.ts";

const app = new Application();

// Middleware para CORS
app.use(oakCors());

// Configuración de rutas
const routers = [
    propietarioRouter, 
    mascotaRouter, 
    especieRouter, 
    razaRouter, 
    veterinarioRouter, 
    citaRouter
];

routers.forEach((router) => {
    app.use(router.routes());
    app.use(router.allowedMethods());
});

// Mensaje de inicio del servidor
console.log("Servidor de la Veterinaria corriendo en el puerto 8000");

// Iniciar el servidor
app.listen({ port: 8000 });