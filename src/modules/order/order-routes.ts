import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { orderControllers } from "./order-controllers";

const router = Router();

//POST:api/v1/orders/:medicineId -> create a new order || customer
router.post("/:medicineId", proxy(["CUSTOMER"]), orderControllers.createOrder);

//PATCH:api/v1/orders/:orderId -> cancelled order before confirmation || customer & admin
router.patch(
  "/:orderId",
  proxy(["CUSTOMER", "ADMIN"]),
  orderControllers.cancelOrder,
);

export const orderRoutes = router;
