export type MenuItemStatus = "AVAILABLE" | "UNAVAILABLE"

export enum MenuItemStatusEnum {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
}

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


type MenuItemModal = "createMenuItem" | "deleteMenuItem" | "editMenuItem";

export interface MenuItemStore {
    selectedMenuItem: MenuItemResponseDTO | null;
    modal: MenuItemModal | null;

    page: number;
    size: number;
    search: string;
    status: MenuItemStatus | null;
    categoryId: number | null;
    isAvailable: boolean | null;

    setSelectedMenuItem: (menuItem: MenuItemResponseDTO | null) => void;
    setModal: (modal: MenuItemModal | null) => void;
    closeModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    setStatus: (status: MenuItemStatus | null) => void;
    setCategoryId: (categoryId: number | null) => void;
    setIsAvailable: (isAvailable: boolean | null) => void;
    resetFilters: () => void;
}