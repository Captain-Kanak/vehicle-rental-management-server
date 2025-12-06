import { Request, Response } from "express";
import envConfig from "./config";
import app from "./app";

const port = envConfig.port || 5000;

//* Default Routes
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Vehicle Rental System Server is Running Successfully!",
  });
});

app.get("/api/v1", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Vehicle Rental System API v1",
  });
});

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

//* Start the server
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
