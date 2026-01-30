import createError from "http-errors";
import { Order } from "../../../generated/prisma/client";
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

export const orderServices = {
  createOrder,
};
