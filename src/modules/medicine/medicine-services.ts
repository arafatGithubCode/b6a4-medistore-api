import createError from "http-errors";
import { Medicine, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { FilterOptions } from "../../types";

const createMedicine = async (payload: Medicine) => {
  // check if the category exists
  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  // check if the medicine with same slug and brand exists
  const existingMedicine = await prisma.medicine.findUnique({
    where: { slug: payload.slug, brand: payload.brand },
  });

  if (existingMedicine) {
    throw createError(409, "Medicine with this slug already exists");
  }

  const newMedicine = await prisma.medicine.create({
    data: payload,
  });
  return newMedicine;
};

const updateMedicineById = async (id: string, payload: Partial<Medicine>) => {
  // check if the medicine exists
  await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });

  const updatedMedicine = await prisma.medicine.update({
    where: { id },
    data: payload,
  });
  return updatedMedicine;
};

const getMedicineById = async (id: string) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });
  return medicine;
};

const getAllMedicines = async ({
  searchTerm,
  status,
  categoryId,
  id,
}: FilterOptions) => {
  const andClauses: Prisma.MedicineWhereInput[] = [];

  if (searchTerm) {
    andClauses.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (status) {
    andClauses.push({
      status: {
        equals: status,
      },
    });
  }

  if (categoryId) {
    andClauses.push({ categoryId });
  }

  if (id) {
    andClauses.push({ id });
  }
  const result = await prisma.medicine.findMany({
    where: {
      AND: andClauses.length > 0 ? andClauses : undefined,
    },
  });

  return result;
};

export const medicineServices = {
  createMedicine,
  updateMedicineById,
  getMedicineById,
  getAllMedicines,
};
