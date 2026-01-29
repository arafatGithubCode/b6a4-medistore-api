import { NextFunction, Request, Response } from "express";
import { sendJSON } from "../helpers/send-json";
import { auth } from "../lib/auth";

export type Resource = "user" | "medicine" | "order" | "review" | "category";
export type Action = "create" | "read" | "update" | "delete";

export const proxy = (resource: Resource, action: Action) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>,
      });

      if (!session || !session.user) {
        sendJSON(false, res, 401, "Unauthorized");
      }

      const hasPermission = await auth.api.userHasPermission({
        body: {
          userId: session?.user.id,
          role: session?.user.role || ("CUSTOMER" as any),
          permission: { [resource]: [action] },
        },
      });

      if (!hasPermission || !hasPermission.success) {
        sendJSON(false, res, 403, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
