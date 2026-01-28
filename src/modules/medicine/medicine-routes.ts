import { Router } from "express";
import { medicineControllers } from "./medicine-controllers";

const router = Router();

//POST:api/v1/medicine -> create a new medicine
router.post("/", medicineControllers.createMedicine);

export const medicineRoutes = router;
