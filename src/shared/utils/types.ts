import { OrderStatus } from "@/src/ordering";

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page index (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface QueryParams {
  search?: string;
  categoryId?: number | null 
  status?: OrderStatus | null;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}