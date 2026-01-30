import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { orderControllers } from "./order-controllers";

const router = Router();

//POST:api/v1/orders/:medicineId -> create a new order || customer
router.post("/:medicineId", proxy(["CUSTOMER"]), orderControllers.createOrder);

//PATCH:api/v1/orders/:orderId/status -> update order status || admin & seller
router.patch(
  "/:orderId/status",
  proxy(["ADMIN", "SELLER"]),
  orderControllers.updateOrderStatus,
);

//PATCH:api/v1/orders/:orderId/cancel -> cancel order status || customer
router.patch(
  "/:orderId/cancel",
  proxy(["CUSTOMER"]),
  orderControllers.cancelOrderStatus,
);

//GET:api/v1/orders/:orderId -> get order by id || customer, seller & admin
router.get(
  "/:orderId",
  proxy(["CUSTOMER", "SELLER", "ADMIN"]),
  orderControllers.getOrderById,
);

//GET:api/v1/orders/-> get orders by current user id || customer & admin & seller
router.get(
  "/",
  proxy(["CUSTOMER", "ADMIN", "SELLER"]),
  orderControllers.getOrdersByUserId,
);

export const orderRoutes = router;
