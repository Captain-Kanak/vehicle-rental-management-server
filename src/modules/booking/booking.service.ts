import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import getRentDays from "../../utilities/getRentDays";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  console.log({ payload });

  try {
    const vehicleResult = await pool.query(
      `
        SELECT *
        FROM vehicles
        WHERE id = $1
      `,
      [vehicle_id]
    );

    console.log({ vehicleResult });

    if (vehicleResult.rows.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
      };
    }

    const vehicle = vehicleResult.rows[0];

    console.log({ vehicle });

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

    console.log({ rentDays });

    // if (typeof rentDays !== "number") {
    //   return {
    //     success: false,
    //     message: "Invalid rent days",
    //   };
    // }

    if (rentDays === null) {
      return {
        success: false,
        message: "Invalid rent days",
      };
    }

    const total_price = rentDays * vehicle.daily_rent_price;

    console.log({ rentDays, total_price });

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

    console.log({ newBooking });

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

    console.log({ newBooking });

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

const getBookings = async (decodedUser: JwtPayload) => {
  const { id: customer_id, role } = decodedUser;
  try {
    if (role === "admin") {
      const result = await pool.query(
        `
          SELECT *
          FROM bookings
        `
      );

      if (result.rows.length === 0) {
        return {
          success: true,
          message: "No bookings found",
          data: [],
        };
      }

      const bookings = result.rows;

      for (let booking of bookings) {
        const customer_id = booking.customer_id;
        const vehicle_id = booking.vehicle_id;

        const customerResult = await pool.query(
          `
            SELECT name, email
            FROM users
            WHERE id = $1
          `,
          [customer_id]
        );

        const vehicleResult = await pool.query(
          `
            SELECT vehicle_name, registration_number
            FROM vehicles
            WHERE id = $1
          `,
          [vehicle_id]
        );

        booking.customer = customerResult.rows[0];
        booking.vehicle = vehicleResult.rows[0];
      }

      return {
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
      };
    }

    const result = await pool.query(
      `
        SELECT id, vehicle_id, rent_start_date, rent_end_date, total_price, status
        FROM bookings
        WHERE customer_id = $1
      `,
      [customer_id]
    );

    if (result.rows.length === 0) {
      return {
        success: true,
        message: "No bookings found",
        data: [],
      };
    }

    const bookings = result.rows;

    for (let booking of bookings) {
      const vehicle_id = booking.vehicle_id;

      const vehicleResult = await pool.query(
        `
          SELECT vehicle_name, registration_number, type
          FROM vehicles
          WHERE id = $1
        `,
        [vehicle_id]
      );

      booking.vehicle = vehicleResult.rows[0];
    }

    return {
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const updateBooking = async (
  bookingId: number,
  payload: Record<string, unknown>,
  user: JwtPayload
) => {
  const { role, id: customer_id } = user;
  const { status } = payload;

  try {
    const result = await pool.query(
      `
        SELECT *
        FROM bookings
        WHERE id = $1
      `,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    const booking = result.rows[0];

    if (role === "customer" && status === "cancelled") {
      if (booking.customer_id !== customer_id) {
        return {
          success: false,
          message: "You are not authorized to cancel this booking",
        };
      }

      const startDate = new Date(booking.rent_start_date);

      if (startDate <= new Date()) {
        return {
          success: false,
          message: "Cannot cancel booking that has already started",
        };
      }

      const cancelResult = await pool.query(
        `
          UPDATE bookings
          SET status = $2
          WHERE id = $1
          RETURNING *
        `,
        [bookingId, status]
      );

      await pool.query(
        `
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = $1
            `,
        [booking.vehicle_id]
      );

      return {
        success: true,
        message: "Booking cancelled successfully",
        data: cancelResult.rows[0],
      };
    }

    if (role === "admin" && (status === "returned" || status === "cancelled")) {
      const startDate = new Date(booking.rent_start_date);

      if (startDate <= new Date()) {
        return {
          success: false,
          message: "Cannot cancel booking that has already started",
        };
      }

      const updateResult = await pool.query(
        `
          UPDATE bookings
          SET status = $2
          WHERE id = $1
          RETURNING *
        `,
        [bookingId, status]
      );

      await pool.query(
        `
          UPDATE vehicles
          SET availability_status = 'available'
          WHERE id = $1
        `,
        [booking.vehicle_id]
      );

      if (status === "cancelled") {
        return {
          success: true,
          message: "Booking marked as cancelled. Vehicle is now available",
          data: updateResult.rows[0],
        };
      }

      return {
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: updateResult.rows[0],
      };
    }

    return {
      success: false,
      message: "Unauthorized or invalid status change",
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
  getBookings,
  updateBooking,
};
