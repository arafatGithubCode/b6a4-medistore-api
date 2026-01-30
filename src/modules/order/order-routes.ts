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

//GET:api/v1/orders/:orderId -> get order by id || customer, seller & admin
router.get(
  "/:orderId",
  proxy(["CUSTOMER", "SELLER", "ADMIN"]),
  orderControllers.getOrderById,
);

export const orderRoutes = router;
