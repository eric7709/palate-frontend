export type MenuItemStatus = "AVAILABLE" | "UNAVAILABLE"

export interface MenuItemResponseDTO {
    id: number;
    name: string;
    price: number;
    description: string;
    status: MenuItemStatus;
    imageUrl: string;
    categoryId: number;
    categoryName: string;
}

export interface MenuItemRequestDTO {
  name?: string;
  categoryId?: number; // Java Long maps to TypeScript number
  price?: number;      // Java Double maps to TypeScript number
  status?: string;
  imageUrl?: string;
  description?: string;
}


export interface MenuItemStore {
    selectedMenuItem: MenuItemResponseDTO | null;
    isFormOpen: boolean;
    isDeleteModalOpen: boolean;

    page: number;
    size: number;
    search: string;
    status: string;
    categoryId: number | null;
    isAvailable: boolean | null;

    setSelectedMenuItem: (menuItem: MenuItemResponseDTO | null) => void;
    openForm: () => void;
    closeForm: () => void;
    openDeleteModal: () => void;
    closeDeleteModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    setStatus: (status: string) => void;
    setCategoryId: (categoryId: number | null) => void;
    setIsAvailable: (isAvailable: boolean | null) => void;
    resetFilters: () => void;
}