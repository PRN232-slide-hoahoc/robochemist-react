import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { ExamService } from '@/services/exam/examService';
import type { ExamMatrix, ExamRequest } from '@/types/exam.types';
import toast from 'react-hot-toast';

export const ExamsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [matrices, setMatrices] = useState<ExamMatrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<string>('');
  const FIXED_PRICE = 20000; // Set cứng giá 20,000 VND
  const [loading, setLoading] = useState(false);
  const [loadingMatrices, setLoadingMatrices] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requests, setRequests] = useState<ExamRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch matrices on mount
  useEffect(() => {
    const fetchMatrices = async () => {
      setLoadingMatrices(true);
      try {
        const data = await ExamService.getAllMatrices();
        setMatrices(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading matrices:', err);
        toast.error(err.message || 'Không thể tải danh sách ma trận đề thi');
      } finally {
        setLoadingMatrices(false);
      }
    };

    fetchMatrices();
  }, []);

  // Fetch exam requests when user is authenticated
  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoadingRequests(false);
        return;
      }

      setLoadingRequests(true);
      try {
        const data = await ExamService.getExamRequestsByUserId(user.id);
        console.log('[ExamsPage] Exam Requests:', data);
        setRequests(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading exam requests:', err);
        toast.error(err.message || 'Không thể tải danh sách yêu cầu');
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, user]);

  const handleCreateRequest = async () => {
    if (!selectedMatrix) {
      setError('Vui lòng chọn ma trận đề');
      toast.error('Vui lòng chọn ma trận đề');
      return;
    }

    if (!user?.id) {
      setError('Bạn cần đăng nhập để tạo yêu cầu');
      toast.error('Bạn cần đăng nhập để tạo yêu cầu');
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      await ExamService.createExamRequest({
        MatrixId: selectedMatrix,
        Price: FIXED_PRICE,
      });
      
      toast.success('Tạo yêu cầu thành công!');
      
      // Refresh exam requests list
      const updatedRequests = await ExamService.getExamRequestsByUserId(user.id);
      setRequests(updatedRequests);
      
      // Reset form
      setSelectedMatrix('');
    } catch (err: any) {
      setError(err.message || 'Tạo yêu cầu thất bại');
      toast.error(err.message || 'Tạo yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (examId: string) => {
    try {
      setLoading(true);
      await ExamService.downloadExam(examId);
      toast.success('Đang tải xuống đề thi...');
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải xuống đề thi');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadByRequest = async (examRequestId: string) => {
    try {
      setLoading(true);
      
      // Get exam request details to find generated exam ID
      const request = await ExamService.getExamRequestById(examRequestId);
      console.log('[Download] Exam Request Details:', request);
      
      if (request.generatedExams && request.generatedExams.length > 0) {
        const examId = request.generatedExams[0].generatedExamId;
        await ExamService.downloadExam(examId);
        toast.success('Đang tải xuống đề thi...');
      } else {
        toast.error('Chưa có đề thi nào được tạo cho yêu cầu này');
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải xuống đề thi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'Hoàn thành';
      case 'Processing':
        return 'Đang xử lý';
      case 'Failed':
        return 'Thất bại';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Pending':
      default:
        return 'Đang chờ';
    }
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Đề thi & Bài tập</h1>
          <p className="text-sm text-gray-600">Tạo và quản lý đề thi, ngân hàng câu hỏi và lịch làm bài.</p>
        </div>

        {/* Create Exam Request Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tạo yêu cầu tạo đề</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn ma trận đề thi
                </label>
                {loadingMatrices ? (
                  <div className="text-sm text-gray-500">Đang tải danh sách ma trận...</div>
                ) : matrices.length === 0 ? (
                  <div className="text-sm text-gray-500">Chưa có ma trận đề thi nào</div>
                ) : (
                  <select 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={selectedMatrix} 
                    onChange={(e) => setSelectedMatrix(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">-- Chọn ma trận --</option>
                    {matrices.map((m) => (
                      <option key={m.matrixId} value={m.matrixId}>
                        {m.name} ({m.totalQuestion} câu)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá
                </label>
                <div className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50">
                  <span className="font-semibold text-blue-600">{FIXED_PRICE.toLocaleString('vi-VN')} VND</span>
                  <span className="text-sm text-gray-500 ml-2">(Giá cố định)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateRequest} 
                  disabled={loading || loadingMatrices || !selectedMatrix}
                >
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exam Requests List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu tạo đề của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRequests ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Đang tải danh sách yêu cầu...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Bạn chưa có yêu cầu nào</p>
                <p className="text-sm text-gray-500 mt-2">
                  Hãy tạo yêu cầu mới ở phía trên để bắt đầu
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => {
                  console.log('[ExamRequest]', {
                    id: r.examRequestId,
                    status: r.status,
                    generatedExams: r.generatedExams,
                    hasExams: r.generatedExams?.length > 0
                  });
                  
                  return (
                  <div 
                    key={r.examRequestId} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">
                          {r.matrixName || 'Ma trận không xác định'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(r.status)}`}>
                          {getStatusText(r.status)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Mã yêu cầu: <span className="font-mono">{r.examRequestId}</span></p>
                        {r.createdAt && (
                          <p>Ngày tạo: {new Date(r.createdAt).toLocaleString('vi-VN')}</p>
                        )}
                        {r.generatedExams && r.generatedExams.length > 0 && (
                          <p className="text-green-600 font-medium">
                            Đã tạo {r.generatedExams.length} đề thi
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {r.status === 'Completed' ? (
                        <>
                          {r.generatedExams && r.generatedExams.length > 0 ? (
                            // Có dữ liệu generatedExams - dùng generatedExamId
                            r.generatedExams.map((exam: any) => (
                              <Button 
                                key={exam.generatedExamId || exam.id}
                                variant="default"
                                onClick={() => handleDownload(exam.generatedExamId || exam.id)}
                                disabled={loading}
                              >
                                📥 Tải xuống đề thi
                              </Button>
                            ))
                          ) : (
                            // Status = Completed nhưng chưa có generatedExams - thử download bằng requestId
                            <Button 
                              variant="default"
                              onClick={() => handleDownloadByRequest(r.examRequestId)}
                              disabled={loading}
                            >
                              📥 Tải xuống đề thi
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {r.status === 'Processing' && '⏳ Đang xử lý...'}
                          {r.status === 'Pending' && '⏳ Đang chờ xử lý...'}
                          {r.status === 'Failed' && '❌ Tạo đề thất bại'}
                        </div>
                      )}
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to detail page or show modal
                          toast('Tính năng xem chi tiết đang được phát triển', {
                            icon: 'ℹ️',
                          });
                        }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default ExamsPage;
