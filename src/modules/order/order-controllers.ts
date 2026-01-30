import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Order, OrderStatus } from "../../../generated/prisma/client";
import { paginationSort } from "../../helpers/pagination-sort";
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
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw createError(400, "Bad Request: Order ID is missing");
    }
    if (typeof orderId !== "string") {
      throw createError(400, "Bad Request: Order ID must be a string");
    }
    const result = await orderServices.cancelOrder(orderId);
    res.status(200).json({ message: "Order cancelled successfully", result });
  } catch (error) {
    next(error);
  }
};

const confirmedOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw createError(400, "Bad Request: Order ID is missing");
    }
    if (typeof orderId !== "string") {
      throw createError(400, "Bad Request: Order ID must be a string");
    }
    const result = await orderServices.confirmedOrder(orderId);
    res.status(200).json({ message: "Order confirmed successfully", result });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw createError(400, "Bad Request: Order ID is missing");
    }
    if (typeof orderId !== "string") {
      throw createError(400, "Bad Request: Order ID must be a string");
    }
    const result = await orderServices.getOrderById(orderId);
    res.status(200).json({ message: "Order fetched successfully", result });
  } catch (error) {
    next(error);
  }
};

const getOrdersByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(req.query);
    const customerId = req.params.customerId;

    if (!customerId) {
      throw createError(400, "Bad Request: Customer ID is missing");
    }
    if (typeof customerId !== "string") {
      throw createError(400, "Bad Request: Customer ID must be a string");
    }

    const status = req.query.status as OrderStatus | undefined;

    const { data, pagination } = await orderServices.getOrdersByCustomerId({
      status,
      customerId,
      page,
      limit,
      sortBy,
      sortOrder,
      skip,
    });
    res
      .status(200)
      .json({ message: "Orders fetched successfully", data, pagination });
  } catch (error) {
    next(error);
  }
};

export const orderControllers = {
  createOrder,
  cancelOrder,
  confirmedOrder,
  getOrderById,
  getOrdersByCustomerId,
};
