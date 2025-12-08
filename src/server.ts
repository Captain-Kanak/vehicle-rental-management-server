import { Request, Response } from "express";
import envConfig from "./config";
import app from "./app";
import autoReturnExpiredBookings from "./utilities/autoReturnExpiredBookings";

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

//* Auto return expired bookings every hour
setInterval(async () => {
  await autoReturnExpiredBookings();
}, 60 * 60 * 1000);

//* Start the server
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
