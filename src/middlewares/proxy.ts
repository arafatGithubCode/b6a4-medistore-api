import { NextFunction, Request, Response } from "express";
import { User } from "../../generated/prisma/client";
import { Role } from "../../generated/prisma/enums";
import { sendJSON } from "../helpers/send-json";
import { auth } from "../lib/auth";

export const proxy = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>,
      });

      if (!session || !session.user) {
        sendJSON(false, res, 401, "Unauthorized");
      }

      // set the user in request object
      req.user = {
        ...session!.user,
        banned: null,
        banReason: null,
        banExpires: null,
      } as User;

      // check for roles
      if (roles.length && !roles.includes(req.user.role)) {
        sendJSON(false, res, 403, "Forbidden: Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
