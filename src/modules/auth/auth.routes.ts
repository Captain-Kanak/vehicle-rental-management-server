import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/signup", authControllers.handleSignup);

router.post("/signin", authControllers.handleSignin);

export { router as authRoutes };
