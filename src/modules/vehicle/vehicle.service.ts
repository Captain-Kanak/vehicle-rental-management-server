import { pool } from "../../config/db";

const addVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  try {
    const result = await pool.query(
      `
        INSERT INTO vehicles (
          vehicle_name,
          type,
          registration_number,
          daily_rent_price,
          availability_status
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    return {
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getVehicles = async () => {
  try {
    const result = await pool.query(
      `
        SELECT * FROM vehicles
      `
    );

    return {
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const vehicleServices = {
  addVehicle,
  getVehicles,
};
