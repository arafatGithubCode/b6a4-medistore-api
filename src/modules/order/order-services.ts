import createError from "http-errors";
import { Order, OrderStatus, Prisma } from "../../../generated/prisma/client";
import { OrderWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { PaginationOptions } from "../../types";

const createOrder = async (payload: Order) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: { id: payload.medicineId },
  });

  // check medicine stock availability
  if (medicine.stock < payload.quantity) {
    throw createError(400, "Insufficient stock for the requested medicine");
  }

  const totalAmount = medicine.price * payload.quantity;
  payload.totalAmount = totalAmount;

  const result = await prisma.$transaction(async (tx) => {
    // deduct the ordered quantity from medicine stock
    await tx.medicine.update({
      where: { id: payload.medicineId },
      data: { stock: { decrement: payload.quantity } },
    });

    // create the order
    return await tx.order.create({
      data: payload,
    });
  });

  return result;
};

const cancelOrder = async (id: string) => {
  // check order existence
  const order = await prisma.order.findUniqueOrThrow({
    where: { id },
  });

  // check if the order is not placed
  if (order.status !== OrderStatus.PLACED) {
    throw createError(400, "Only placed orders can be cancelled");
  }

  const result = await prisma.$transaction(async (tx) => {
    // restore the ordered quantity back to medicine stock
    await tx.medicine.update({
      where: { id: order.medicineId },
      data: { stock: { increment: order.quantity } },
    });
    // update the order status to cancelled
    return await tx.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  });

  return result;
};

const confirmedOrder = async (id: string) => {
  // check order existence
  const order = await prisma.order.findUniqueOrThrow({
    where: { id },
  });

  // check if the order is already confirmed
  if (order.status === OrderStatus.CONFIRMED) {
    throw createError(400, "Order is already confirmed");
  }

  // check if the order is cancelled
  if (order.status === OrderStatus.CANCELLED) {
    throw createError(400, "Cancelled orders cannot be confirmed");
  }

  // check if the order is not placed
  if (order.status !== OrderStatus.PLACED) {
    throw createError(400, "Only placed orders can be confirmed");
  }

  const result = await prisma.order.update({
    where: { id },
    data: { status: OrderStatus.CONFIRMED },
  });

  return result;
};

const getOrderById = async (id: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const getOrdersByCustomerId = async ({
  status,
  customerId,
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: PaginationOptions & {
  status: OrderStatus | undefined;
  customerId: string;
}) => {
  const andClauses: OrderWhereInput[] = [{ userId: customerId }];

  if (status) {
    andClauses.push({ status });
  }

  const result = await prisma.order.findMany({
    where: {
      AND: andClauses,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder as Prisma.SortOrder,
    },
  });

  const total = await prisma.order.count({
    where: {
      AND: andClauses,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const orderServices = {
  createOrder,
  cancelOrder,
  confirmedOrder,
  getOrderById,
  getOrdersByCustomerId,
};
