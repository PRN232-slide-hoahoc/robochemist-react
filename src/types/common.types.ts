/**
 * Common utility types
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * API State type
 */
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Error type
 */
export interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

