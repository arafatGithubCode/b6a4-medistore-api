import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationOptions } from "../../types";

const me = async (id: string) => {
  const data = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  return data;
};

const getAllUsers = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
}: PaginationOptions) => {
  const data = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.user.count();
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id: string) => {
  const data = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  return data;
};

const deleteUserById = async (id: string) => {
  const data = await prisma.user.delete({
    where: { id },
  });
  return data;
};

const updateUserById = async (
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "email">>,
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });
  return updatedUser;
};

export const userServices = {
  me,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};
