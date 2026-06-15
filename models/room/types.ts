import { PageResponse } from '@/types/pageResponse';

// Supported interface modal views
export type RoomModal = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW_QR' | null;

export type RoomStatus = "AVAILABLE" | "UNAVAILABLE";

export interface RoomResponseDTO {
  id: number;
  roomNumber: string;
  floor: number | null;
  qrCode: string;
  status: RoomStatus;
  cashierId: number | null;
  cashierName: string | null;
}

export interface RoomRequestDTO {
  roomNumber: string;
  floor: number | null;
  status: RoomStatus;
  cashierId: number | null;
}

export type RoomFilterParams = {
  page: number;
  size: number;
  search: string;
  status: RoomStatus | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};

export interface RoomStore {
  // State variables
  filters: RoomFilterParams;
  search: string
  roomPage: PageResponse<RoomResponseDTO> | null;
  selectedRoom: RoomResponseDTO | null; // Tracks the context for Updates, Deletes, and QR codes
  modal: RoomModal;
  isLoading: boolean;
  error: string | null;

  // Filter actions
  setFilters: (filters: Partial<RoomFilterParams>) => void;
  setSearch: (search: string) => void;
  setStatusFilter: (status: RoomStatus | null) => void;
  setPage: (page: number) => void;
  setSorting: (sortBy: RoomFilterParams['sortBy'], direction?: 'asc' | 'desc') => void;
  resetFilters: () => void;

  // Window/Modal actions
  setModal: (modal: RoomModal, room?: RoomResponseDTO | null) => void;
  closeModal: () => void;
  setSelectedRoom: (room: RoomResponseDTO | null) => void;

  // Global Sync bindings
  setRoomPage: (page: PageResponse<RoomResponseDTO>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}