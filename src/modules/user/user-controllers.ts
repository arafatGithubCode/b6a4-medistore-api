import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { paginationSort } from "../../helpers/pagination-sort";
import { userServices } from "./user-services";

const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const data = await userServices.me(userId);
    res.status(200).json({ message: "User fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, sortBy, sortOrder, skip } = paginationSort(_req.query);
    const { data, pagination } = await userServices.getAllUsers({
      page,
      limit,
      sortBy,
      sortOrder,
      skip,
    });
    res
      .status(200)
      .json({ message: "Users fetched successfully", data, pagination });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const data = await userServices.getUserById(userId);
    res.status(200).json({ message: "User fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const data = await userServices.deleteUserById(userId);
    res.status(200).json({ message: "User deleted successfully", data });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw createError(400, "Bad Request: User ID is missing");
    }
    if (typeof userId !== "string") {
      throw createError(400, "Bad Request: User ID must be a string");
    }
    const updateData = req.body;

    // prevent updating restricted fields
    delete updateData.id;
    delete updateData.email;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    const data = await userServices.updateUserById(userId, updateData);
    res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  me,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};
