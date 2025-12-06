import express, { Application, json, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initializeDB from "./config/db";

//* Create Express application
const app: Application = express();

//* Middleware to parse JSON requests
app.use(json());

//* Initialize Database
initializeDB();

app.use("/api/v1/auth", authRoutes);

export default app;
