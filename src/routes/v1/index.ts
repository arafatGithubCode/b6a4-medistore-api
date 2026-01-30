import { Router } from "express";
import { categoryRoutes } from "../../modules/category/category-routes";
import { medicineRoutes } from "../../modules/medicine/medicine-routes";
import { orderRoutes } from "../../modules/order/order-routes";
import { userRoutes } from "../../modules/user/user-routes";

const router = Router();

router.use("/medicines", medicineRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

export const v1Routes = router;
