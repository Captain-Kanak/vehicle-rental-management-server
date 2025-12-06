import { Request, Response } from "express";
import { authServices } from "./auth.service";

const handleSignup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.handleSignup(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const handleSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.handleSignin(email, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authControllers = {
  handleSignup,
  handleSignin,
};
