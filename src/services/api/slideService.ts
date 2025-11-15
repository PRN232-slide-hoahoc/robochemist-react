import { axiosInstance } from './axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';

/**
 * Grade types
 */
export interface Grade {
  id: string;
  name: string;
  description?: string;
}

/**
 * Topic types
 */
export interface Topic {
  id: string;
  name: string;
  gradeId: string;
  grade?: Grade;
  sortOrder?: number;
}

/**
 * Syllabus types
 */
export interface Syllabus {
  id: string;
  lesson: string;
  topicId: string;
  topic?: Topic;
  topicName?: string;
  isActive?: boolean;
  lessonOrder?: number;
}

/**
 * Template types
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  objectKey: string;
  userId: string;
  createdAt: string;
}

/**
 * Slide generation request
 */
export interface GenerateSlideRequest {
  syllabusId: string;
  numberOfSlides: number;
  aiPrompt?: string;
  templateId?: string;
}

/**
 * Slide generation response
 */
export interface GenerateSlideResponse {
  generatedSlideId: string;
  filePath?: string | null;
  slideCount?: number | null;
  generationStatus?: string | null;
  jsonContent?: string | null;
}

/**
 * Slide detail item (matches backend SlideDetailDto)
 */
export interface SlideDetailDto {
  generatedSlideId: string;
  slideRequestId: string;
  fileFormat?: string;
  filePath?: string;
  fileSize?: number;
  slideCount?: number;
  generationStatus?: string;
  processingTime?: number;
  generatedAt?: string;
  // Request information
  numberOfSlides?: number;
  aiPrompt?: string;
  requestStatus?: string;
  requestedAt?: string;
  // Syllabus information
  syllabusId: string;
  syllabusLesson: string;
  learningObjectives?: string;
  lessonOrder?: number;
  // Topic information
  topicId: string;
  topicName: string;
  topicSortOrder?: number;
  // Grade information
  gradeId: string;
  gradeName: string;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

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
  async getSyllabuses(topicId?: string): Promise<Syllabus[]> {
    const url = topicId 
      ? `${API_ENDPOINTS.SLIDES.SYLLABUSES}?topicId=${topicId}`
      : API_ENDPOINTS.SLIDES.SYLLABUSES;
    
    const response = await axiosInstance.get<ApiResponse<Syllabus[]>>(url);
    const data = response.data.data ?? response.data;
    return Array.isArray(data) ? data : [];
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
    const payload: any = {
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
    
    return response.data.data ?? response.data as any;
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
};

export default slideService;
