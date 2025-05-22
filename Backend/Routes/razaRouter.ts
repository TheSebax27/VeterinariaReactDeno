import { Router } from "./Dependencies/dependencias.ts";
import {
    getRazas,
    getRazasPorEspecie
} from "../Controllers/razaController.ts";

const razaRouter = new Router();

razaRouter.get("/razas", getRazas);
razaRouter.get("/razas/especie/:idEspecie", getRazasPorEspecie);

export { razaRouter };