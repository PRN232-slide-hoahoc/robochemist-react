/**
 * Template types - Match backend DTOs
 */

export interface Template {
  templateId: string;
  objectKey: string;
  templateName: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  cloudflareUrl?: string;
  contentStructure?: string;
  slideCount: number;
  isPremium: boolean;
  price: number;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: number;
}

export interface UserTemplate {
  templateId: string;
  objectKey: string;
  templateName: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  contentStructure?: string;
  slideCount: number;
  isPremium: boolean;
  price: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: number;
}

/**
 * UserTemplateResponse - Returned from GetMyTemplates endpoint
 * Contains complete template information accessible by current user
 */
export interface UserTemplateResponse {
  templateId: string;
  objectKey: string;
  templateName: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  contentStructure?: string;
  slideCount: number;
  isPremium: boolean;
  price: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: number;
}

export interface UploadTemplateRequest {
  file: File;
  thumbnailFile?: File; // Optional thumbnail image
  templateName: string;
  description?: string;
  slideCount?: number; // Optional - backend defaults to 0
  isPremium: boolean;
  price: number;
}

export interface UploadTemplateResponse {
  templateId: string;
  objectKey: string;
  templateName: string;
  message: string;
}

export interface GrantTemplateAccessRequest {
  templateId: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface TemplateFilters extends PaginationParams {
  isPremium?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
