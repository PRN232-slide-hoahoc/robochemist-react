/**
 * Slide-related types
 */

/**
 * Grade model
 */
export interface Grade {
  id: string;
  name: string;
  description?: string;
}

/**
 * Topic model
 */
export interface Topic {
  id: string;
  name: string;
  gradeId: string;
  grade?: Grade;
  sortOrder?: number;
}

/**
 * Syllabus model
 */
export interface Syllabus {
  id: string;
  lesson: string;
  topicId: string;
  topic?: Topic;
  topicName?: string;
  isActive?: boolean;
  lessonOrder?: number;
  learningObjectives?: string;
  contentOutline?: string;
  keyConcepts?: string;
}

/**
 * Create/Update Syllabus request
 */
export interface CreateSyllabusRequest {
  topicId: string;
  lessonOrder: number;
  lesson: string;
  learningObjectives: string;
  contentOutline: string;
  keyConcepts: string;
}

/**
 * Template model
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
 * Paginated Result (Backend format for slides)
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
 * Slide detail DTO (matches backend SlideDetailDto)
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
