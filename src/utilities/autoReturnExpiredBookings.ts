import { pool } from "../config/db";

const autoReturnExpiredBookings = async () => {
  try {
    const result = await pool.query(
      `
        SELECT id, vehicle_id 
        FROM bookings
        WHERE status = 'active'
        AND rent_end_date < NOW()
      `
    );

    if (result.rows.length === 0) return;

    for (const booking of result.rows) {
      const { id: bookingId, vehicle_id } = booking;

      await pool.query(
        `
          UPDATE bookings
          SET status = 'returned'
          WHERE id = $1
        `,
        [bookingId]
      );

      await pool.query(
        `
          UPDATE vehicles
          SET availability_status = 'available'
          WHERE id = $1
        `,
        [vehicle_id]
      );
    }

    console.log(
      `Auto-return completed. Updated ${result.rows.length} bookings.`
    );
  } catch (error) {
    console.error("Auto-return job failed:", error);
  }
};

export default autoReturnExpiredBookings;
