import { Router } from "./Dependencies/dependencias.ts";
import {
    getVeterinarios,
    getVeterinariosPorEstado,
    getVeterinarioPorId,
    postVeterinarios,
    putVeterinarios
} from "../Controllers/veterinarioController.ts";

const veterinarioRouter = new Router();

veterinarioRouter.get("/veterinarios", getVeterinarios);
veterinarioRouter.get("/veterinarios/estado/:activo", getVeterinariosPorEstado);
veterinarioRouter.get("/veterinarios/:id", getVeterinarioPorId);
veterinarioRouter.post("/veterinarios", postVeterinarios);
veterinarioRouter.put("/veterinarios", putVeterinarios);

export { veterinarioRouter };