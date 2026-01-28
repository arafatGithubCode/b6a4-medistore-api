import { Router } from "express";
import { categoryControllers } from "./category-controllers";

const router = Router();

//POST:api/v1/category -> create a new category
router.post("/", categoryControllers.createCategory);

export const categoryRoutes = router;
