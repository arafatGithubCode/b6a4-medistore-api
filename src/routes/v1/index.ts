import { Router } from "express";
import { categoryRoutes } from "../../modules/category/category-routes";
import { medicineRoutes } from "../../modules/medicine/medicine-routes";
const router = Router();

router.use("/medicines", medicineRoutes);
router.use("/categories", categoryRoutes);

export const v1Routes = router;
