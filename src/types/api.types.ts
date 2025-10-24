/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

