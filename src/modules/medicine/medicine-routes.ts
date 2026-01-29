import { Router } from "express";
import { proxy } from "./../../middlewares/proxy";
import { medicineControllers } from "./medicine-controllers";

const router = Router();

//POST:api/v1/medicine -> create a new medicine || seller & admin
router.post(
  "/",
  proxy(["SELLER", "ADMIN"]),
  medicineControllers.createMedicine,
);

//PUT:api/v1/medicine/:id -> update a medicine || seller & admin
router.put(
  "/:id",
  proxy(["SELLER", "ADMIN"]),
  medicineControllers.updateMedicineById,
);

//GET:api/v1/medicine -> get all medicines || public
router.get("/", medicineControllers.getAllMedicines);

//GET:api/v1/medicine/:id -> get medicine by id || public
router.get("/:id", medicineControllers.getMedicineById);

export const medicineRoutes = router;
