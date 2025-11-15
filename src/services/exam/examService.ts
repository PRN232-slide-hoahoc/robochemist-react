import { axiosInstance } from '../api/axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';
import type {
  ExamMatrix,
  ExamRequest,
  CreateExamRequestDto,
  ExamRequestResponse,
  MatrixListResponse,
  ExamRequestListResponse,
  GeneratedExam,
} from '@/types/exam.types';

/**
 * Exam Service
 * Handles all API calls related to exam functionality
 */
export class ExamService {
  /**
   * Get all exam matrices
   */
  static async getAllMatrices(): Promise<ExamMatrix[]> {
    try {
      const response = await axiosInstance.get<MatrixListResponse>(
        API_ENDPOINTS.EXAM.MATRICES_BASE
      );
      
      // Handle different response structures
      const data = response.data?.data ?? response.data;
      
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          matrixId: item.matrixId ?? item.id ?? '',
          name: item.name ?? item.matrixName ?? 'Chưa đặt tên',
          totalQuestion: item.totalQuestion ?? 0,
          isActive: item.isActive ?? true,
          createdBy: item.createdBy ?? '',
          createdAt: item.createdAt ?? '',
          updatedBy: item.updatedBy ?? '',
          updatedAt: item.updatedAt ?? '',
          matrixDetails: item.matrixDetails ?? [],
        }));
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching matrices:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải danh sách ma trận đề thi');
    }
  }

  /**
   * Get matrix by ID
   */
  static async getMatrixById(matrixId: string): Promise<ExamMatrix> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXAM.MATRIX_BY_ID(matrixId)
      );
      
      const data = response.data?.data ?? response.data;
      
      return {
        matrixId: data.matrixId ?? data.id ?? matrixId,
        name: data.name ?? data.matrixName ?? 'Chưa đặt tên',
        totalQuestion: data.totalQuestion ?? 0,
        isActive: data.isActive ?? true,
        createdBy: data.createdBy ?? '',
        createdAt: data.createdAt ?? '',
        updatedBy: data.updatedBy ?? '',
        updatedAt: data.updatedAt ?? '',
        matrixDetails: data.matrixDetails ?? [],
      };
    } catch (error: any) {
      console.error('Error fetching matrix:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải thông tin ma trận');
    }
  }

  /**
   * Create exam request
   */
  static async createExamRequest(
    dto: CreateExamRequestDto
  ): Promise<ExamRequestResponse> {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.EXAM.REQUEST,
        dto
      );
      
      const data = response.data?.data ?? response.data;
      
      return {
        examRequestId: data.examRequestId ?? data.id ?? '',
        userId: data.userId ?? '',
        matrixId: data.matrixId ?? '',
        matrixName: data.matrixName ?? '',
        status: data.status ?? 'Pending',
        createdAt: data.createdAt ?? '',
        generatedExams: data.generatedExams ?? [],
      };
    } catch (error: any) {
      console.error('Error creating exam request:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tạo yêu cầu thi');
    }
  }

  /**
   * Get exam requests by user ID
   */
  static async getExamRequestsByUserId(userId: string): Promise<ExamRequest[]> {
    try {
      const response = await axiosInstance.get<ExamRequestListResponse>(
        API_ENDPOINTS.EXAM.REQUEST_BY_USER(userId)
      );
      
      const data = response.data?.data ?? response.data;
      
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          examRequestId: item.examRequestId ?? item.id ?? '',
          userId: item.userId ?? userId,
          matrixId: item.matrixId ?? '',
          matrixName: item.matrixName ?? '',
          status: item.status ?? 'Pending',
          createdAt: item.createdAt ?? new Date().toISOString(),
          generatedExams: item.generatedExams ?? [],
        }));
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching exam requests:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải danh sách yêu cầu');
    }
  }

  /**
   * Get exam request by ID
   */
  static async getExamRequestById(requestId: string): Promise<ExamRequest> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXAM.REQUEST_BY_ID(requestId)
      );
      
      const data = response.data?.data ?? response.data;
      
      return {
        examRequestId: data.examRequestId ?? data.id ?? requestId,
        userId: data.userId ?? '',
        matrixId: data.matrixId ?? '',
        matrixName: data.matrixName ?? '',
        status: data.status ?? 'Pending',
        createdAt: data.createdAt ?? new Date().toISOString(),
        generatedExams: data.generatedExams ?? [],
      };
    } catch (error: any) {
      console.error('Error fetching exam request:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải thông tin yêu cầu');
    }
  }

  /**
   * Get exam by ID
   */
  static async getExamById(examId: string): Promise<GeneratedExam> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXAM.EXAM_BY_ID(examId)
      );
      
      const data = response.data?.data ?? response.data;
      
      return {
        generatedExamId: data.generatedExamId ?? data.id ?? examId,
        examRequestId: data.examRequestId ?? '',
        status: data.status ?? 'PENDING',
        createdAt: data.createdAt ?? '',
        examQuestions: data.examQuestions ?? [],
      };
    } catch (error: any) {
      console.error('Error fetching exam:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải thông tin đề thi');
    }
  }

  /**
   * Get exam status
   */
  static async getExamStatus(examId: string): Promise<string> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXAM.EXAM_STATUS(examId)
      );
      
      const data = response.data?.data ?? response.data;
      
      return data.status ?? 'Unknown';
    } catch (error: any) {
      console.error('Error fetching exam status:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải trạng thái đề thi');
    }
  }

  /**
   * Download exam file as Word document
   */
  static async downloadExam(examId: string): Promise<void> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXAM.EXAM_EXPORT_WORD(examId),
        {
          responseType: 'blob', // Important for file download
        }
      );
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `exam_${examId}.docx`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]|^\s+|\s+$/g, '');
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading exam:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải xuống đề thi');
    }
  }
}

export default ExamService;
