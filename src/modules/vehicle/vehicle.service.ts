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
        SELECT *
        FROM vehicles
      `
    );

    if (result.rows.length === 0) {
      return {
        success: true,
        message: "No vehicles found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getVehicleById = async (id: number) => {
  try {
    const result = await pool.query(
      `
        SELECT *
        FROM vehicles
        WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return {
        success: true,
        message: "No vehicle found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const updateVehicleById = async (
  id: number,
  payload: Record<string, unknown>
) => {
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
        UPDATE vehicles
        SET
          vehicle_name = $2,
          type = $3,
          registration_number = $4,
          daily_rent_price = $5,
          availability_status = $6
        WHERE id = $1
        RETURNING *
      `,
      [
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
      };
    }

    return {
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const deleteVehicleById = async (id: number) => {
  console.log(id);
  try {
    const result = await pool.query(
      `
        DELETE FROM vehicles
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Vehicle not found",
      };
    }

    return {
      success: true,
      message: "Vehicle deleted successfully",
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
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
