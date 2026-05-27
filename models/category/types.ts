import { SpringPage } from "@/utils/types";

export interface CategoryResponseDTO {
  id: number;
  name: string;
  description: string;
  status: string;
  menuItemCount: number; // Java long maps perfectly to TypeScript number
}

export interface CategoryRequestDTO {
  name: string;
  description: string;
}

export interface CategoryStore {
  categories: CategoryResponseDTO[];
  pagination: Omit<SpringPage<CategoryResponseDTO>, 'content'>;
  loading: boolean;
  error: string | null;
  // Actions
  fetchCategories: (page: number, size: number) => Promise<void>;
}