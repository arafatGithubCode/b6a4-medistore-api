import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { sendJSON } from "../helpers/send-json";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // prismaClientKnownRequestError handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint failed
        statusCode = 409;
        message = "Unique constraint failed";
        break;
      case "P2025": // Record not found
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003": // Foreign key constraint failed
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;
      case "P2000": // Value too long for column
        statusCode = 400;
        message = "Value too long for column";
        break;
      default:
        statusCode = 400;
        message = "Database error";
    }
  }

  // prismaClientValidationError handling
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "You provided incorrect field type or missing required field.";
  }

  // prismaClientRequestUnknownError handling
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "An unknown error occurred while processing the request.";
  }

  // prismaClientInitializationError handling
  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Failed to initialize database connection.";
  }

  // generic error handling
  if (
    !(err instanceof Prisma.PrismaClientKnownRequestError) &&
    !(err instanceof Prisma.PrismaClientValidationError) &&
    !(err instanceof Prisma.PrismaClientUnknownRequestError) &&
    !(err instanceof Prisma.PrismaClientInitializationError)
  ) {
    message = err.message || message;
  }

  sendJSON(false, res, statusCode, message);
};
