import { axiosInstance } from './axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';
import type { 
  Grade, 
  Topic, 
  Syllabus, 
  Template,
  GenerateSlideRequest,
  GenerateSlideResponse,
  SlideDetailDto,
  PaginatedResult,
  CreateSyllabusRequest
} from '@/types/slide.types';

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// Re-export types for backward compatibility
export type { 
  Grade, 
  Topic, 
  Syllabus, 
  Template,
  GenerateSlideRequest,
  GenerateSlideResponse,
  SlideDetailDto,
  PaginatedResult,
  CreateSyllabusRequest
} from '@/types/slide.types';

/**
 * Slide Service - Handles all slide-related API calls
 */
export const slideService = {
  /**
   * Get all grades
   */
  async getGrades(): Promise<Grade[]> {
    const response = await axiosInstance.get<ApiResponse<Grade[]>>(API_ENDPOINTS.SLIDES.GRADES);
    const data = response.data.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get topics by grade ID (with filtering)
   */
  async getTopicsByGrade(gradeId?: string): Promise<Topic[]> {
    const url = gradeId 
      ? `${API_ENDPOINTS.SLIDES.TOPICS}?gradeId=${gradeId}`
      : API_ENDPOINTS.SLIDES.TOPICS;
    
    const response = await axiosInstance.get<ApiResponse<Topic[]>>(url);
    const data = response.data.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get all topics
   */
  async getTopics(): Promise<Topic[]> {
    return this.getTopicsByGrade();
  },

  /**
   * Get syllabuses by topic ID (with filtering)
   */
  async getSyllabuses(gradeId?: string, topicId?: string): Promise<Syllabus[]> {
    const params = new URLSearchParams();
    if (gradeId && gradeId.trim()) params.append('gradeId', gradeId);
    if (topicId && topicId.trim()) params.append('topicId', topicId);
    
    const url = params.toString() 
      ? `${API_ENDPOINTS.SLIDES.SYLLABUSES}?${params.toString()}`
      : API_ENDPOINTS.SLIDES.SYLLABUSES;
    
    console.log('Fetching syllabuses from:', url);
    console.log('Query params:', { gradeId, topicId });
    
    const response = await axiosInstance.get<ApiResponse<Syllabus[]>>(url);
    const data = response.data.data ?? response.data;
    console.log('Received syllabuses:', data);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get syllabus by ID
   */
  async getSyllabusById(id: string): Promise<Syllabus> {
    const response = await axiosInstance.get<ApiResponse<Syllabus>>(
      API_ENDPOINTS.SLIDES.SYLLABUS_BY_ID(id)
    );
    return (response.data.data ?? response.data) as Syllabus;
  },

  /**
   * Create new syllabus
   */
  async createSyllabus(request: CreateSyllabusRequest): Promise<Syllabus> {
    const response = await axiosInstance.post<ApiResponse<Syllabus>>(
      API_ENDPOINTS.SLIDES.SYLLABUSES,
      request
    );
    return (response.data.data ?? response.data) as Syllabus;
  },

  /**
   * Update syllabus
   */
  async updateSyllabus(id: string, request: CreateSyllabusRequest): Promise<Syllabus> {
    const response = await axiosInstance.put<ApiResponse<Syllabus>>(
      API_ENDPOINTS.SLIDES.SYLLABUS_BY_ID(id),
      request
    );
    return (response.data.data ?? response.data) as Syllabus;
  },

  /**
   * Toggle syllabus status
   */
  async toggleSyllabusStatus(id: string): Promise<boolean> {
    const response = await axiosInstance.patch<ApiResponse<boolean>>(
      API_ENDPOINTS.SLIDES.SYLLABUS_TOGGLE_STATUS(id)
    );
    return response.data.data ?? false;
  },

  /**
   * Get user templates
   */
  async getTemplates(): Promise<Template[]> {
    const response = await axiosInstance.get<ApiResponse<Template[]>>(API_ENDPOINTS.TEMPLATE.TEMPLATES);
    const data = response.data.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get slide generation history with pagination, filtering, and sorting
   */
  async getSlideHistory(
    pageNumber: number = 1, 
    pageSize: number = 10,
    gradeId?: string,
    topicId?: string,
    generationStatus?: string,
    sortBy: string = 'GeneratedAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<SlideDetailDto>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy,
      sortOrder,
    });

    if (gradeId) params.append('gradeId', gradeId);
    if (topicId) params.append('topicId', topicId);
    if (generationStatus) params.append('generationStatus', generationStatus);

    const response = await axiosInstance.get<ApiResponse<PaginatedResult<SlideDetailDto>>>(
      `${API_ENDPOINTS.SLIDES.BASE}?${params.toString()}`
    );
    
    return response.data.data || {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  },

  /**
   * Generate slides
   */
  async generateSlide(request: GenerateSlideRequest): Promise<GenerateSlideResponse> {
    const payload: Record<string, unknown> = {
      syllabusId: request.syllabusId,
      numberOfSlides: request.numberOfSlides,
      templateId: request.templateId,
    };

    // Only include aiPrompt if it has a value
    if (request.aiPrompt) {
      payload.aiPrompt = request.aiPrompt;
    }

    console.log('Sending generate slide request:', payload);

    const response = await axiosInstance.post<ApiResponse<GenerateSlideResponse>>(
      API_ENDPOINTS.SLIDES.GENERATE,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 600000,
      }
    );
    
    console.log('Generate slide response:', response.data);
    
    return (response.data.data ?? response.data) as GenerateSlideResponse;
  },

  /**
   * Download slide file by ID
   */
  async downloadSlide(slideId: string): Promise<Blob> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.SLIDES.SLIDE_DOWNLOAD(slideId),
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Download file by object key (filePath from backend)
   */
  async downloadFileByPath(objectKey: string): Promise<Blob> {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TEMPLATE.FILES_DOWNLOAD}?objectKey=${encodeURIComponent(objectKey)}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Change slide template
   */
  async changeSlideTemplate(slideId: string, templateId: string): Promise<void> {
    await axiosInstance.post(
      API_ENDPOINTS.SLIDES.CHANGE_TEMPLATE,
      { 
        slideId: slideId,
        templateId 
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },
};

export default slideService;
