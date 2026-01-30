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

const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  // Fetch the current order
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
  });

  // Validate state transitions
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PLACED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  if (!validTransitions[order.status]?.includes(newStatus)) {
    throw createError(
      400,
      `Cannot transition from ${order.status} to ${newStatus}`,
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
};

const getOrderById = async (id: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const getOrdersByUserId = async ({
  status,
  userId,
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: PaginationOptions & {
  status: OrderStatus | undefined;
  userId: string;
}) => {
  const andClauses: OrderWhereInput[] = [{ userId }];

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
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
};
