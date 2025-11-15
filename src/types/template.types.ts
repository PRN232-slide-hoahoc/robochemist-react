/**
 * Template types - Match backend DTOs
 */

export interface Template {
  templateId: string;
  objectKey: string;
  templateName: string;
  templateType: string;
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
  userTemplateId: string;
  userId: string;
  templateId: string;
  templateName: string;
  templateType: string;
  accessType: string;
  acquiredAt: string;
  expiresAt?: string;
  usageCount: number;
  usageLimit?: number;
  isActive: boolean;
  isExpired: boolean;
  hasReachedLimit: boolean;
}

export interface UploadTemplateRequest {
  file: File;
  templateName: string;
  templateType: string;
  description?: string;
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
  accessType: 'free' | 'purchased' | 'subscription';
  expiresAt?: string;
  usageLimit?: number;
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
  templateType?: string;
  isPremium?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
