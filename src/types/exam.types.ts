/**
 * Exam Service Types - Mapped from backend DTOs
 */

// ==================== Matrix DTOs ====================

export interface ExamMatrix {
  matrixId: string;
  name: string;
  totalQuestion: number;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  matrixDetails?: MatrixDetail[];
}

export interface MatrixBasic {
  matrixId: string;
  name: string;
  totalQuestion: number;
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
}

export interface MatrixDetail {
  matrixDetailsId: string;
  topicId: string;
  topicName: string;
  questionType: string; // 'MultipleChoice' | 'TrueFalse' | 'FillBlank' | 'Essay'
  level?: string; // 'NhanBiet' | 'ThongHieu' | 'VanDung' | 'VanDungCao'
  questionCount: number;
  isActive: boolean;
}

// ==================== Question DTOs ====================

export interface Question {
  questionId: string;
  topicId: string;
  topicName?: string; // From API Composition
  questionType: string; // 'MultipleChoice' | 'TrueFalse' | 'FillBlank' | 'Essay'
  questionText: string;
  explanation?: string;
  level?: string; // 'NhanBiet' | 'ThongHieu' | 'VanDung' | 'VanDungCao'
  status: string; // "1" = Active, "0" = Inactive
  createdAt?: string;
  createdBy?: string;
  options: Option[];
}

export interface Option {
  optionId: string;
  answer: string;
  isCorrect: boolean;
  createdAt?: string;
  createdBy?: string;
}

// ==================== Exam Request DTOs ====================

export interface ExamRequest {
  examRequestId: string;
  userId: string;
  matrixId: string;
  matrixName: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  createdAt?: string;
  generatedExams: GeneratedExam[];
}

export interface CreateExamRequestDto {
  MatrixId: string;
  Price: number;
}

export interface ExamRequestResponse {
  examRequestId: string;
  userId: string;
  matrixId: string;
  matrixName: string;
  status: string;
  createdAt?: string;
  generatedExams: GeneratedExam[];
}

// ==================== Generated Exam DTOs ====================

export interface GeneratedExam {
  generatedExamId: string;
  examRequestId: string;
  status: string; // 'PENDING' | 'READY' | 'EXPIRED'
  createdAt?: string;
  examQuestions: ExamQuestion[];
}

export interface ExamQuestion {
  examQuestionId: string;
  generatedExamId: string;
  questionId: string;
  questionOrder: number;
  points: number;
  questionDetail?: QuestionDetail;
}

export interface QuestionDetail {
  questionId: string;
  questionType: string;
  questionText: string;
  explanation?: string;
  options: OptionDetail[];
}

export interface OptionDetail {
  optionId: string;
  answer: string;
  isCorrect: boolean;
}

// ==================== API Response Wrappers ====================

export interface MatrixListResponse {
  data: ExamMatrix[];
  total?: number;
}

export interface MatrixBasicListResponse {
  data: MatrixBasic[];
  total?: number;
}

export interface ExamRequestListResponse {
  data: ExamRequest[];
  total?: number;
}
