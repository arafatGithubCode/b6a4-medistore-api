import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Order } from "../../../generated/prisma/client";
import { orderServices } from "./order-services";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: Order = req.body || {};
    const userId = req.user?.id;
    const medicineId = req.params.medicineId;

    // check userId and medicineId existence
    if (!userId) {
      throw createError(401, "Unauthorized: User ID is missing");
    }
    if (!medicineId) {
      throw createError(400, "Bad Request: Medicine ID is missing");
    }

    if (typeof medicineId !== "string") {
      throw createError(400, "Bad Request: Medicine ID must be a string");
    }

    payload.userId = userId;
    payload.medicineId = medicineId;

    const result = await orderServices.createOrder(payload);
    res.status(201).json({ message: "Order created successfully", result });
  } catch (error) {
    console.error("Error in createOrder:", error);
    next(error);
  }
};

export const orderControllers = {
  createOrder,
};
