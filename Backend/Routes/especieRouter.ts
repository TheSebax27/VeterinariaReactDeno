import { Router } from "./Dependencies/dependencias.ts";
import { getEspecies } from "../Controllers/especieController.ts";

const especieRouter = new Router();

especieRouter.get("/especies", getEspecies);

export { especieRouter };