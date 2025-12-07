import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.addVehicle(req.body);

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

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicles();

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

const getVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleServices.getVehicleById(Number(vehicleId));

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

const updateVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleServices.updateVehicleById(
      Number(vehicleId),
      req.body
    );

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

const deleteVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleServices.deleteVehicleById(Number(vehicleId));

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

export const vehicleControllers = {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
