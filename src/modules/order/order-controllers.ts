import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { OrderStatus } from "../../../generated/prisma/client";
import { paginationSort } from "../../helpers/pagination-sort";
import { TOrderPayload } from "../../types";
import { orderServices } from "./order-services";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: TOrderPayload = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized: User ID is missing");
    }

    if (
      !payload.items ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0
    ) {
      throw createError(
        400,
        "Bad Request: Order must include at least one item.",
      );
    }

    const data = await orderServices.createOrder(payload, userId);
    res.status(201).json({ message: "Order created successfully", data });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (
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
    const { status } = req.body;

    // check valid status
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status)) {
      throw createError(400, "Bad Request: Invalid order status");
    }

    const data = await orderServices.updateOrderStatus(orderId, status);
    res
      .status(200)
      .json({ message: "Order status updated successfully", data });
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
    const data = await orderServices.getOrderById(orderId);
    res.status(200).json({ message: "Order fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const cancelOrderStatus = async (
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
    const data = await orderServices.cancelOrderStatus(orderId);
    res.status(200).json({ message: "Order cancelled successfully", data });
  } catch (error) {
    next(error);
  }
};

const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(req.query);
    const userId = req.user?.id;

    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }

    const status = req.query.status as OrderStatus | undefined;

    const { data, pagination } = await orderServices.getOrdersByUserId({
      status,
      userId,
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
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  cancelOrderStatus,
};
