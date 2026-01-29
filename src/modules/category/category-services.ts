import createError from "http-errors";
import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category) => {
  const isExist = await prisma.category.findUnique({
    where: { slug: payload.slug },
  });

  if (isExist) {
    throw createError(409, "Category with this slug already exists");
  }

  const newCategory = await prisma.category.create({
    data: payload,
  });
  return newCategory;
};

const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  return category;
};

export const categoryServices = {
  createCategory,
  getCategoryBySlug,
};
