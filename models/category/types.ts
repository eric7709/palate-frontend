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


type CategoryModal = "createCategory" | "deleteCategory" | "editCategory"

export interface CategoryStore {
    selectedCategory: CategoryResponseDTO | null;
    modal: CategoryModal | null;

    page: number;
    size: number;
    search: string;
    status: string;

    setSelectedCategory: (category: CategoryResponseDTO | null) => void;
    setModal: (modal: CategoryModal | null) => void;
    closeModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    setStatus: (status: string) => void;
    resetFilters: () => void;
}
