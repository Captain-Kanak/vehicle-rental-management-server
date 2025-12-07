import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const getUsers = async () => {
  try {
    const result = await pool.query(
      `
        SELECT id, name, email, phone, role FROM users
      `
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "No users found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const updateUser = async (
  userId: number,
  user: JwtPayload | undefined,
  payload: Record<string, unknown>
) => {
  const { name, email, phone, role } = payload;

  try {
    const dbResult = await pool.query(
      `
        SELECT id, name, email, phone, role
        FROM users
        WHERE id = $1
    `,
      [userId]
    );

    if (dbResult.rows.length === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const dbUser = dbResult.rows[0];

    const isValidUser =
      user && (user.role === "admin" || user.email === dbUser.email);

    if (!isValidUser) {
      return {
        success: false,
        message: "You are not authorized to update this user",
      };
    }

    const result = await pool.query(
      `
        UPDATE users
        SET
          name = $2,
          email = $3,
          phone = $4,
          role = $5
        WHERE id = $1
        RETURNING id, name, email, phone, role
      `,
      [userId, name, email, phone, role]
    );

    return {
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const userServices = {
  getUsers,
  updateUser,
};
