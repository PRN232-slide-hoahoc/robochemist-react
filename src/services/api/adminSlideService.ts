import { axiosInstance } from './axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';

/**
 * Generated Slide Detail DTO (from backend)
 */
export interface SlideDetailDto {
  generatedSlideId: string;
  slideRequestId: string;
  fileFormat?: string;
  filePath?: string;
  fileSize?: number;
  slideCount?: number;
  generationStatus?: string; // "Pending" | "Completed" | "Failed"
  processingTime?: number;
  generatedAt?: string;
  
  // Request info
  numberOfSlides?: number;
  aiPrompt?: string;
  requestStatus?: string;
  requestedAt?: string;
  
  // Syllabus info
  syllabusId: string;
  syllabusLesson: string;
  learningObjectives?: string;
  lessonOrder?: number;
  
  // Topic info
  topicId: string;
  topicName: string;
  topicSortOrder?: number;
  
  // Grade info
  gradeId: string;
  gradeName: string;
}

/**
 * Paginated response
 */
export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
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
 * Get slides request parameters
 */
export interface GetSlidesParams {
  pageNumber?: number;
  pageSize?: number;
  gradeId?: string;
  topicId?: string;
  generationStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin Slide Service - Handles admin slide management API calls
 */
export const adminSlideService = {
  /**
   * Get all slides with filters and pagination (Admin only)
   */
  async getSlides(params: GetSlidesParams = {}): Promise<PaginatedResult<SlideDetailDto>> {
    const queryParams = new URLSearchParams();
    
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.gradeId) queryParams.append('gradeId', params.gradeId);
    if (params.topicId) queryParams.append('topicId', params.topicId);
    if (params.generationStatus) queryParams.append('generationStatus', params.generationStatus);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const url = `${API_ENDPOINTS.SLIDES.ALL}?${queryParams.toString()}`;
    const response = await axiosInstance.get<ApiResponse<PaginatedResult<SlideDetailDto>>>(url);
    
    return response.data.data || {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
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
   * Get slide statistics
   */
  async getStatistics(): Promise<{
    total: number;
    completed: number;
    jsonCreated: number;
    fileCreated: number;
    failed: number;
    pending: number;
  }> {
    // Get all slides without pagination to calculate stats
    const result = await this.getSlides({ pageSize: 1000 });
    
    const stats = {
      total: result.totalCount,
      completed: 0,
      jsonCreated: 0,
      fileCreated: 0,
      failed: 0,
      pending: 0,
    };
    
    for (const slide of result.items) {
      const status = slide.generationStatus?.trim() || '';
      if (status === 'Hoàn thành') stats.completed++;
      else if (status === 'Đã tạo dữ liệu') stats.jsonCreated++;
      else if (status === 'Đã tạo tệp') stats.fileCreated++;
      else if (status === 'Thất bại') stats.failed++;
      else stats.pending++;
    }
    
    return stats;
  },

  /**
   * Get all grades for filter
   */
  async getGrades(): Promise<Array<{ id: string; name: string }>> {
    const response = await axiosInstance.get<ApiResponse<Array<{ id: string; name: string }>>>(
      API_ENDPOINTS.SLIDES.GRADES
    );
    
    return response.data.data || [];
  },

  /**
   * Get topics by grade for filter
   */
  async getTopics(gradeId?: string): Promise<Array<{ id: string; name: string; gradeId: string }>> {
    const url = gradeId 
      ? `${API_ENDPOINTS.SLIDES.TOPICS}?gradeId=${gradeId}`
      : API_ENDPOINTS.SLIDES.TOPICS;
    
    const response = await axiosInstance.get<ApiResponse<Array<{ id: string; name: string; gradeId: string }>>>(url);
    
    return response.data.data || [];
  },
};

export default adminSlideService;
