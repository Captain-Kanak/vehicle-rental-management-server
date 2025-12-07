import express, { Application, json, Request, Response } from "express";
import initializeDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

//* Create Express application
const app: Application = express();

//* Middleware to parse JSON requests
app.use(json());

//* Initialize Database
initializeDB();

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

//* Not Found Route Handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "404 Route not found",
    route: req.url,
    path: req.path,
    url: req.originalUrl,
  });
});

export default app;
