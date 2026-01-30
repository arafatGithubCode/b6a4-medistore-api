import { OrderStatus, Review } from "../../../generated/prisma/client";
import { ReviewWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { PaginationOptions } from "../../types";

const createReview = async (payload: Review) => {
  // check if the medicineId exists
  await prisma.medicine.findUniqueOrThrow({
    where: { id: payload.medicineId },
  });

  // check if the order is status is 'Delivered' for this user and medicine
  const deliveredOrder = await prisma.order.findFirst({
    where: {
      medicineId: payload.medicineId,
      userId: payload.userId,
      status: OrderStatus.DELIVERED,
    },
  });

  if (!deliveredOrder) {
    throw new Error(
      "You can only review medicines that you have ordered and received.",
    );
  }

  // check if the user has already reviewed this medicine
  const existingReview = await prisma.review.findFirst({
    where: {
      medicineId: payload.medicineId,
      userId: payload.userId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine.");
  }

  // check rating is between 1 and 5
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const review = await prisma.review.create({
    data: payload,
  });
  return review;
};

const updateReview = async (reviewId: string, payload: Partial<Review>) => {
  // check if review exists
  await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
  });
  return updatedReview;
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: { id },
  });
  return review;
};

const getAllReviews = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  skip,
  rating,
}: PaginationOptions & { rating: number | undefined }) => {
  const andClauses: ReviewWhereInput[] = [];

  if (rating !== undefined) {
    andClauses.push({ rating: rating });
  }
  const reviews = await prisma.review.findMany({
    where: {
      AND: andClauses,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.review.count({
    where: {
      AND: andClauses,
    },
  });

  return {
    data: reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const deleteReviewById = async (id: string) => {
  const review = await prisma.review.delete({
    where: { id },
  });
  return review;
};

export const reviewServices = {
  createReview,
  updateReview,
  getReviewById,
  getAllReviews,
  deleteReviewById,
};
