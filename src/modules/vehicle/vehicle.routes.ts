import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware("admin"), vehicleControllers.addVehicle);

router.get("/", vehicleControllers.getVehicles);

router.get("/:vehicleId", vehicleControllers.getVehicleById);

router.put(
  "/:vehicleId",
  authMiddleware("admin"),
  vehicleControllers.updateVehicleById
);

router.delete(
  "/:vehicleId",
  authMiddleware("admin"),
  vehicleControllers.deleteVehicleById
);

export const vehicleRoutes = router;
