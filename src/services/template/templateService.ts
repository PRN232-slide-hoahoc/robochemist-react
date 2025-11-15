import { axiosInstance as apiClient } from '../api/axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';
import type {
  Template,
  UserTemplate,
  UploadTemplateRequest,
  UploadTemplateResponse,
  GrantTemplateAccessRequest,
  PagedResult,
  TemplateFilters,
} from '@/types/template.types';
import type { ApiResponse } from '@/types/api.types';

const TEMPLATE_API_BASE = API_ENDPOINTS.TEMPLATE.TEMPLATES;
const USER_TEMPLATE_API_BASE = '/template/v1/user-templates';

/**
 * Template Service - Handles all template-related API calls
 */
export const templateService = {
  /**
   * Get paginated list of ACTIVE templates with filters (for public users)
   * This endpoint returns only active templates (IsActive = true)
   */
  async getTemplates(filters?: TemplateFilters): Promise<PagedResult<Template>> {
    const params = new URLSearchParams();
    
    if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDescending !== undefined) params.append('sortDescending', filters.sortDescending.toString());
    if (filters?.isPremium !== undefined) params.append('isPremium', filters.isPremium.toString());
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await apiClient.get<ApiResponse<PagedResult<Template>>>(
      `${TEMPLATE_API_BASE}?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get paginated list of ALL templates including inactive ones (for Staff/Admin management)
   * This endpoint returns all templates regardless of IsActive status
   */
  async getTemplatesForStaff(filters?: TemplateFilters): Promise<PagedResult<Template>> {
    const params = new URLSearchParams();
    
    if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDescending !== undefined) params.append('sortDescending', filters.sortDescending.toString());
    if (filters?.isPremium !== undefined) params.append('isPremium', filters.isPremium.toString());
    // Note: isActive filter is ignored on backend for staff endpoint
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await apiClient.get<ApiResponse<PagedResult<Template>>>(
      `${API_ENDPOINTS.TEMPLATE.TEMPLATES_STAFF}?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<Template> {
    const response = await apiClient.get<ApiResponse<Template>>(
      API_ENDPOINTS.TEMPLATE.TEMPLATE_BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Upload a new template
   */
  async uploadTemplate(request: UploadTemplateRequest): Promise<UploadTemplateResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('templateName', request.templateName);
    formData.append('slideCount', (request.slideCount || 0).toString());
    formData.append('isPremium', request.isPremium.toString());
    formData.append('price', request.price.toString());
    if (request.description) {
      formData.append('description', request.description);
    }
    if (request.thumbnailFile) {
      formData.append('thumbnailFile', request.thumbnailFile);
    }

    const response = await apiClient.post<ApiResponse<UploadTemplateResponse>>(
      API_ENDPOINTS.TEMPLATE.TEMPLATE_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Update an existing template
   */
  async updateTemplate(id: string, request: Partial<Template>): Promise<Template> {
    const response = await apiClient.put<ApiResponse<Template>>(
      `${TEMPLATE_API_BASE}/${id}`,
      {
        templateName: request.templateName,
        description: request.description,
        slideCount: request.slideCount,
        isPremium: request.isPremium,
        price: request.price,
        isActive: request.isActive,
      }
    );
    return response.data.data;
  },

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `${TEMPLATE_API_BASE}/${id}`
    );
    return response.data.data;
  },

  /**
   * Download template file
   */
  async downloadTemplate(id: string): Promise<Blob> {
    const response = await apiClient.get(API_ENDPOINTS.TEMPLATE.TEMPLATE_DOWNLOAD(id), {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Generate presigned URL for template preview
   */
  async getPresignedUrl(id: string, expirationMinutes: number = 60): Promise<string> {
    const response = await apiClient.get<ApiResponse<string>>(
      `${TEMPLATE_API_BASE}/${id}/presigned-url?expirationMinutes=${expirationMinutes}`
    );
    return response.data.data;
  },

  /**
   * Get user's templates
   */
  async getMyTemplates(): Promise<UserTemplate[]> {
    const response = await apiClient.get<ApiResponse<UserTemplate[]>>(
      `${USER_TEMPLATE_API_BASE}`
    );
    return response.data.data;
  },

  /**
   * Check if user has access to template
   */
  async checkTemplateAccess(templateId: string): Promise<boolean> {
    const response = await apiClient.get<ApiResponse<boolean>>(
      `${USER_TEMPLATE_API_BASE}/${templateId}/access`
    );
    return response.data.data;
  },

  /**
   * Grant template access to user
   */
  async grantTemplateAccess(request: GrantTemplateAccessRequest): Promise<UserTemplate> {
    const response = await apiClient.post<ApiResponse<UserTemplate>>(
      `${USER_TEMPLATE_API_BASE}`,
      request
    );
    return response.data.data;
  },

  /**
   * Revoke template access (Admin only)
   */
  async revokeTemplateAccess(userTemplateId: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `${USER_TEMPLATE_API_BASE}/${userTemplateId}`
    );
    return response.data.data;
  },

  /**
   * Get user templates by user ID (Admin/Staff only)
   */
  async getUserTemplatesByUserId(userId: string): Promise<UserTemplate[]> {
    const response = await apiClient.get<ApiResponse<UserTemplate[]>>(
      `${USER_TEMPLATE_API_BASE}/users/${userId}`
    );
    return response.data.data;
  },
};
