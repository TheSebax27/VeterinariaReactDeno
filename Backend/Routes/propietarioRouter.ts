import { Router } from "./Dependencies/dependencias.ts";
import { 
    getPropietarios, 
    getPropietarioPorId, 
    postPropietarios, 
    putPropietarios, 
    deletePropietarios 
} from "../Controllers/propietarioController.ts";

const propietarioRouter = new Router();

propietarioRouter.get("/propietarios", getPropietarios);
propietarioRouter.get("/propietarios/:id", getPropietarioPorId);
propietarioRouter.post("/propietarios", postPropietarios);
propietarioRouter.put("/propietarios", putPropietarios);
propietarioRouter.delete("/propietarios", deletePropietarios);

export { propietarioRouter };