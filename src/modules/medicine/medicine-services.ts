import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (payload: Medicine) => {
  const newMedicine = await prisma.medicine.create({
    data: payload,
  });
  return newMedicine;
};

export const medicineServices = {
  createMedicine,
};
