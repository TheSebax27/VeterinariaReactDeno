import { Router } from "./Dependencies/dependencias.ts";
import {
    getCitas,
    getCitasPorFecha,
    getCitasPorMascota,
    getCitasPorVeterinario,
    postCitas,
    putEstadoCita,
    deleteCitas
} from "../Controllers/citaController.ts";

const citaRouter = new Router();

citaRouter.get("/citas", getCitas);
citaRouter.get("/citas/fecha/:fecha", getCitasPorFecha);
citaRouter.get("/citas/mascota/:idMascota", getCitasPorMascota);
citaRouter.get("/citas/veterinario/:idVeterinario", getCitasPorVeterinario);
citaRouter.post("/citas", postCitas);
citaRouter.put("/citas/estado", putEstadoCita);
citaRouter.delete("/citas", deleteCitas);

export { citaRouter };