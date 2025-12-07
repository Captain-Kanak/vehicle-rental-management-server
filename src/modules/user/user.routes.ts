import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", authMiddleware("admin"), userControllers.getUsers);

router.put(
  "/:userId",
  authMiddleware("admin", "customer"),
  userControllers.updateUser
);

export const userRoutes = router;
