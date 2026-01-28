import { NextFunction, Request, Response } from "express";
import { Medicine } from "../../../generated/prisma/client";
import { getSlug } from "../../helpers/get-slug";
import { sendJSON } from "./../../helpers/send-json";
import { medicineServices } from "./medicine-services";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: Medicine = req.body;
    payload.slug = getSlug(payload.name);

    const result = await medicineServices.createMedicine(payload);
    console.log(result);
    sendJSON(true, res, 201, "Medicine created successfully");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const medicineControllers = {
  createMedicine,
};
