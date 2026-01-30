import createError from "http-errors";
import { Order, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

export const orderServices = {
  createOrder,
  cancelOrder,
};
