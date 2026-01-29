import { MedicineStatus } from "../../generated/prisma/enums";

export interface FilterOptions {
  searchTerm: string | undefined;
  status: MedicineStatus | undefined;
  categoryId: string | undefined;
  id: string | undefined;
}
