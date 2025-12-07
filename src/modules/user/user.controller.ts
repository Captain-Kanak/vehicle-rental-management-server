import { Request, Response } from "express";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user: JwtPayload | undefined = req.user;
  const payload = req.body;

  try {
    const result = await userServices.updateUser(Number(userId), user, payload);

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

export const userControllers = {
  getUsers,
  updateUser,
};
