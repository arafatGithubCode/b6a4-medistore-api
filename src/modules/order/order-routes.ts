import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { orderControllers } from "./order-controllers";

const router = Router();

//POST:api/v1/orders/:medicineId -> create a new order || customer
router.post("/:medicineId", proxy(["CUSTOMER"]), orderControllers.createOrder);

//PATCH:api/v1/orders/cancel/:orderId -> cancelled order before confirmation || customer & admin
router.patch(
  "/cancel/:orderId",
  proxy(["CUSTOMER", "ADMIN"]),
  orderControllers.cancelOrder,
);

//PATCH:api/v1/orders/confirm/:orderId -> confirm order || seller & admin
router.patch(
  "/confirm/:orderId",
  proxy(["SELLER", "ADMIN"]),
  orderControllers.confirmedOrder,
);

export const orderRoutes = router;
