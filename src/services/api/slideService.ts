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
   * Generate slides
   */
  async generateSlide(request: GenerateSlideRequest): Promise<GenerateSlideResponse> {
    const payload = {
      SyllabusId: request.syllabusId,
      NumberOfSlides: request.numberOfSlides,
      AiPrompt: request.aiPrompt,
      TemplateId: request.templateId,
    };

    const response = await axiosInstance.post<ApiResponse<GenerateSlideResponse>>(
      API_ENDPOINTS.SLIDES.GENERATE, 
      payload
    );
    
    return response.data.data ?? response.data as any;
  },
};

export default slideService;
