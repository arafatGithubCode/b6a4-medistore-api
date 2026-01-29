import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { categoryControllers } from "./category-controllers";

const router = Router();

//POST:api/v1/category -> create a new category || Admin Only
router.post(
  "/",
  proxy("category", "create"),
  categoryControllers.createCategory,
);

export const categoryRoutes = router;
