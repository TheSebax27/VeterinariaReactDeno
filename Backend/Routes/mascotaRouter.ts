import { Router } from "./Dependencies/dependencias.ts";
import {
    getMascotas,
    getMascotasPorPropietario,
    getMascotaPorId,
    postMascotas,
    putMascotas,
    deleteMascotas
} from "../Controllers/mascotaController.ts";

const mascotaRouter = new Router();

mascotaRouter.get("/mascotas", getMascotas);
mascotaRouter.get("/mascotas/propietario/:idPropietario", getMascotasPorPropietario);
mascotaRouter.get("/mascotas/:id", getMascotaPorId);
mascotaRouter.post("/mascotas", postMascotas);
mascotaRouter.put("/mascotas", putMascotas);
mascotaRouter.delete("/mascotas", deleteMascotas);

export { mascotaRouter };