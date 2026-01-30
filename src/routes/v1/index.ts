import { Router } from "express";
import { categoryRoutes } from "../../modules/category/category-routes";
import { medicineRoutes } from "../../modules/medicine/medicine-routes";
import { orderRoutes } from "../../modules/order/order-routes";
const router = Router();

router.use("/medicines", medicineRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);

export const v1Routes = router;
