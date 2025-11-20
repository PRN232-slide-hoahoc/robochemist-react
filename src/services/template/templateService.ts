import { axiosInstance as apiClient } from '../api/axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';
import type {
  Template,
  UserTemplateResponse,
  UploadTemplateRequest,
  UploadTemplateResponse,
  PagedResult,
  TemplateFilters,
} from '@/types/template.types';
import type { ApiResponse } from '@/types/api.types';

const TEMPLATE_API_BASE = API_ENDPOINTS.TEMPLATE.TEMPLATES;

/**
 * Template Service - Handles all template-related API calls
 */
export const templateService = {
  /**
   * Get paginated templates with filters (active templates for users)
   */
  async getTemplates(filters?: TemplateFilters): Promise<PagedResult<Template>> {
    const params = new URLSearchParams();
    
    if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
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
   * Get paginated templates for staff (all templates including inactive)
   */
  async getTemplatesForStaff(filters?: TemplateFilters): Promise<PagedResult<Template>> {
    const params = new URLSearchParams();
    
    if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.isPremium !== undefined) params.append('isPremium', filters.isPremium.toString());
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await apiClient.get<ApiResponse<PagedResult<Template>>>(
      `${API_ENDPOINTS.TEMPLATE.TEMPLATES_STAFF}?${params.toString()}`
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
    if (request.description) formData.append('description', request.description);
    if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile);

    const response = await apiClient.post<ApiResponse<UploadTemplateResponse>>(
      API_ENDPOINTS.TEMPLATE.TEMPLATE_UPLOAD,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
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
    const response = await apiClient.delete<ApiResponse<boolean>>(`${TEMPLATE_API_BASE}/${id}`);
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
   * Get user's owned templates
   */
  async getMyTemplates(): Promise<UserTemplateResponse[]> {
    const response = await apiClient.get<ApiResponse<UserTemplateResponse[]>>(`${TEMPLATE_API_BASE}/my`);
    return response.data.data;
  },

  /**
   * Check if user has access to template
   */
  async checkTemplateAccess(templateId: string): Promise<boolean> {
    const response = await apiClient.get<ApiResponse<boolean>>(`${TEMPLATE_API_BASE}/${templateId}/access`);
    return response.data.data;
  },

  /**
   * Purchase a template
   */
  async purchaseTemplate(templateId: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`${TEMPLATE_API_BASE}/${templateId}/purchase`);
    return response.data.data;
  },
};
