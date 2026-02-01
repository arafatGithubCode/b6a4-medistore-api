import { MedicineStatus } from "../../generated/prisma/enums";

export interface FilterOptions {
  searchTerm: string | undefined;
  status: MedicineStatus | undefined;
  categoryId: string | undefined;
  id: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

export type TOrderPayload = {
  items: {
    medicineId: string;
    quantity: number;
  }[];
};
