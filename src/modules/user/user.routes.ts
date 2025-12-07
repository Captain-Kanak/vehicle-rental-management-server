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

router.delete("/:userId", authMiddleware("admin"), userControllers.deleteUser);

export const userRoutes = router;
