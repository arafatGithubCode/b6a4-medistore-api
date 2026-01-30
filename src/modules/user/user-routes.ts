import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { userControllers } from "./user-controllers";
const router = Router();

//GET:api/v1/users/me -> get current user info || customer, seller & admin
router.get("/me", proxy(["ADMIN", "CUSTOMER", "SELLER"]), userControllers.me);

//GET:api/v1/users/ -> get all users || admin only
router.get("/", proxy(["ADMIN"]), userControllers.getAllUsers);

//GET:api/v1/users/:userId -> get user by id || admin only
router.get("/:userId", proxy(["ADMIN"]), userControllers.getUserById);

//PUT:api/v1/users/:userId -> update user by id || admin & customer & seller
router.put(
  "/:userId",
  proxy(["ADMIN", "CUSTOMER", "SELLER"]),
  userControllers.updateUserById,
);

//DELETE:api/v1/users/:userId -> delete user by id || admin only
router.delete("/:userId", proxy(["ADMIN"]), userControllers.deleteUserById);

export const userRoutes = router;
