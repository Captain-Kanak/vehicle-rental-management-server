import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import envConfig from "../../config";

const handleSignup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  try {
    const existingUser = await pool.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return {
        success: false,
        message: "user already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
      `
        INSERT INTO users (
            name,
            email,
            password,
            phone,
            role
          )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role;
      `,
      [name, email, hashedPassword, phone, role]
    );

    return {
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    };
  } catch (error) {
    return {
      success: false,
      message: "Registration failed",
    };
  }
};

const handleSignin = async (email: string, password: string) => {
  try {
    const result = await pool.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "User Not Exist",
      };
    }
    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      envConfig.jwtSecret as string,
      {
        expiresIn: "1d",
      }
    );

    return {
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Login failed",
    };
  }
};

export const authServices = {
  handleSignup,
  handleSignin,
};
