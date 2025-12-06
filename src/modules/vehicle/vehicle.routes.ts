import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware("admin"), vehicleControllers.addVehicle);

export const vehicleRoutes = router;
