import { Router } from "express";
import { proxy } from "../../middlewares/proxy";
import { reviewControllers } from "./review-controllers";

const router = Router();

//GET:api/v1/reviews || get all reviews || Public
router.get("/", reviewControllers.getAllReviews);

//POST:api/v1/reviews/:medicineId || create a new review || customer
router.post(
  "/:medicineId",
  proxy(["CUSTOMER"]),
  reviewControllers.createReview,
);

//PATCH:api/v1/reviews/:reviewId || update a review || customer & admin
router.patch(
  "/:reviewId",
  proxy(["CUSTOMER", "ADMIN"]),
  reviewControllers.updateReview,
);

//GET:api/v1/reviews/:reviewId || get a review by ID || public
router.get("/:reviewId", reviewControllers.getReviewById);

// DELETE:api/v1/reviews/:reviewId || delete a review by ID || admin & customer
router.delete(
  "/:reviewId",
  proxy(["CUSTOMER", "ADMIN"]),
  reviewControllers.deleteReviewById,
);

export const reviewRoutes = router;
