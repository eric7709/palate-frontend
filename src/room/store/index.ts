import { create } from 'zustand';
import { RoomStore, RoomModal, RoomResponseDTO, RoomStatus } from '../types';
import { initialRoomFilters } from '../constants';

export const useRoomStore = create<RoomStore>((set) => ({
  // --- Initial States ---
  search: "",
  filters: { ...initialRoomFilters },
  roomPage: null,
  selectedRoom: null,
  modal: null,
  isLoading: false,
  error: null,
  // --- Core Filter Operations ---
  setFilters: (partialFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...partialFilters },
    })),

  setSearch: (search) =>
    set((state) => ({
      filters: { 
        ...state.filters, 
        search, 
        page: 0 // Always bounce back to page 0 on fresh lookups
      },
    })),

  setStatusFilter: (status: RoomStatus | null) =>
    set((state) => ({
      filters: { 
        ...state.filters, 
        status, 
        page: 0 // Bounce back to page 0 when filtering changes
      },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  setSorting: (sortBy, direction) =>
    set((state) => {
      // Toggle direction naturally if selecting the same column without an explicit override
      const sortDirection = direction 
        ? direction 
        : state.filters.sortBy === sortBy && state.filters.sortDirection === 'asc' 
          ? 'desc' 
          : 'asc';

      return {
        filters: {
          ...state.filters,
          sortBy,
          sortDirection,
          page: 0,
        },
      };
    }),

  resetFilters: () => set({ filters: { ...initialRoomFilters } }),

  // --- Modal & Item Context Actions ---
  setModal: (modal: RoomModal, room: RoomResponseDTO | null = null) => 
    set({ 
      modal, 
      // Auto-assign context item if provided during modal initialization
      ...(room && { selectedRoom: room }),
      error: null 
    }),

  closeModal: () => 
    set({ 
      modal: null, 
      selectedRoom: null, 
      error: null 
    }),

  setSelectedRoom: (selectedRoom) => set({ selectedRoom }),

  // --- Network API Sync Bindings ---
  setRoomPage: (roomPage) => set({ roomPage }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));