import { RoomFilterParams } from "./types";

export const initialRoomFilters: RoomFilterParams = {
  search: '',
  status: null, 
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc'
};