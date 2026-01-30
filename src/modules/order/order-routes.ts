import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { orderControllers } from "./order-controllers";

const router = Router();

//POST:api/v1/orders/:medicineId -> create a new order || customer
router.post("/:medicineId", proxy(["CUSTOMER"]), orderControllers.createOrder);

export const orderRoutes = router;
