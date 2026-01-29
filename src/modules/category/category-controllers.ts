import { NextFunction, Request, Response } from "express";
import { Category } from "../../../generated/prisma/client";
import { getSlug } from "../../helpers/get-slug";
import { sendJSON } from "../../helpers/send-json";
import { categoryServices } from "./category-services";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: Category = req.body;
    payload.slug = getSlug(payload.name);

    const result = await categoryServices.createCategory(payload);
    sendJSON(true, res, 201, "Category created successfully", result);
  } catch (error) {
    next(error);
  }
};

// const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const
//     } catch (error) {

//     }
// }

export const categoryControllers = {
  createCategory,
};
