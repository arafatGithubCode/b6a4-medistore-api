import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category) => {
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
