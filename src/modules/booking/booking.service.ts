import { pool } from "../../config/db";
import getRentDays from "../../helpers/getRentDays";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  try {
    const vehicleResult = await pool.query(
      `
        SELECT *
        FROM vehicles
        WHERE id = $1
      `,
      [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
      };
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== "available") {
      return {
        success: false,
        message: "Vehicle is not available for booking",
      };
    }

    const rentDays = getRentDays(
      rent_start_date as string,
      rent_end_date as string
    );

    if (typeof rentDays !== "number") {
      return {
        success: false,
        message: "Invalid rent days",
      };
    }

    const total_price = rentDays * vehicle.daily_rent_price;

    const insertResult = await pool.query(
      `
        INSERT INTO bookings (
          customer_id,
          vehicle_id,
          rent_start_date,
          rent_end_date,
          total_price
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    const newBooking = insertResult.rows[0];

    if (newBooking) {
      await pool.query(
        `
          UPDATE vehicles
          SET availability_status = $2
          WHERE id = $1
        `,
        [vehicle_id, "booked"]
      );
    }

    newBooking.vehicle = {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    };

    return {
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const bookingServices = {
  createBooking,
};
