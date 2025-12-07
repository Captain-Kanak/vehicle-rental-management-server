import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware("admin", "customer"),
  bookingControllers.createBooking
);

router.get(
  "/",
  authMiddleware("admin", "customer"),
  bookingControllers.getBookings
);

router.put(
  "/:bookingId",
  authMiddleware("admin", "customer"),
  bookingControllers.updateBooking
);

export { router as bookingRoutes };
