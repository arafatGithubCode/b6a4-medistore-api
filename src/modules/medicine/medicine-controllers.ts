import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Medicine } from "../../../generated/prisma/client";
import { filter } from "../../helpers/filter";
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

    // check user is exists in request
    if (!req.user) {
      return sendJSON(false, res, 401, "Unauthorized");
    }

    payload.sellerId = req.user.id;

    const result = await medicineServices.createMedicine(payload);
    sendJSON(true, res, 201, "Medicine created successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineId = req.params.id;
    if (!medicineId) {
      throw createError(400, "Medicine ID is required");
    }

    if (typeof medicineId !== "string") {
      throw createError(400, "Medicine ID must be a string");
    }

    const payload: Partial<Medicine> = req.body;

    // if name is being updated, update the slug as well
    if (payload.name) {
      payload.slug = getSlug(payload.name);
    }

    // prevent updating sellerId via this route
    if (payload.sellerId) {
      delete payload.sellerId;
    }

    const result = await medicineServices.updateMedicineById(
      medicineId,
      payload,
    );
    sendJSON(true, res, 200, "Medicine updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineId = req.params.id;
    if (!medicineId) {
      throw createError(400, "Medicine ID is required");
    }
    if (typeof medicineId !== "string") {
      throw createError(400, "Medicine ID must be a string");
    }
    const result = await medicineServices.getMedicineById(medicineId);
    sendJSON(true, res, 200, "Medicine fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchTerm, status, categoryId, id } = filter(req.query);

    const result = await medicineServices.getAllMedicines({
      searchTerm,
      status,
      categoryId,
      id,
    });
    console.log(result);
    sendJSON(true, res, 200, "Medicines fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

export const medicineControllers = {
  createMedicine,
  updateMedicineById,
  getMedicineById,
  getAllMedicines,
};
