import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { categoryControllers } from "./category-controllers";

const router = Router();

//POST:api/v1/category -> create a new category || Admin Only
router.post("/", proxy(["ADMIN"]), categoryControllers.createCategory);

//GET:api/v1/category/:slug -> get category by slug || Public
router.get("/:slug", categoryControllers.getCategoryBySlug);

//GET:api/v1/category/id/:id -> get category by id || Public
router.get("/id/:id", categoryControllers.getCategoryById);

// PUT:api/v1/category/:id -> update category by id || Admin Only
router.put("/:id", proxy(["ADMIN"]), categoryControllers.updateCategoryById);

// DELETE:api/v1/category/:id -> delete || Admin Only
router.delete("/:id", proxy(["ADMIN"]), categoryControllers.deleteCategoryById);

export const categoryRoutes = router;
