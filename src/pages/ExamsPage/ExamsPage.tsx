import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { axiosInstance } from '@/services/api/axios.config';
import { endpoints } from '@/services/api/endpoints';

type MatrixItem = { id: string; name?: string; description?: string };
type ExamRequest = {
  examRequestId: string;
  userId?: string;
  matrixId?: string;
  matrixName?: string;
  status?: string;
  createdAt?: string;
  generatedExams?: any[];
};

export const ExamsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [matrices, setMatrices] = useState<MatrixItem[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(50000);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ExamRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        const resp = await axiosInstance.get(endpoints.EXAM.MATRICES_BASE);
        const data = resp.data?.data ?? resp.data;
        if (Array.isArray(data)) {
          setMatrices(data.map((m: any) => ({ id: m.id ?? m.matrixId ?? '', name: m.name ?? m.matrixName ?? m.title, description: m.description })));
        }
      } catch (err) {
        // ignore
      }
    };

    fetchMatrices();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAuthenticated || !user?.id) return;
      try {
        const resp = await axiosInstance.get(endpoints.EXAM.REQUEST_BY_USER(user.id));
        const data = resp.data?.data ?? resp.data ?? [];
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        // ignore
      }
    };

    fetchRequests();
  }, [isAuthenticated, user]);

  const handleCreateRequest = async () => {
    if (!selectedMatrix) {
      setError('Vui lòng chọn ma trận đề');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload = { MatrixId: selectedMatrix, Price: price };
      const resp = await axiosInstance.post(endpoints.EXAM.REQUEST, payload);
      const data = resp.data?.data ?? resp.data;
      // append to requests
      if (data) {
        setRequests((prev) => [data, ...prev]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Tạo yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (examRequestId: string) => {
    try {
      setLoading(true);
      const resp = await axiosInstance.post(endpoints.EXAM.GENERATE(examRequestId));
      const data = resp.data?.data ?? resp.data;
      // on success, refresh requests
      const refreshed = await axiosInstance.get(endpoints.EXAM.REQUEST_BY_USER(user?.id ?? ''));
      const d2 = refreshed.data?.data ?? refreshed.data ?? [];
      setRequests(Array.isArray(d2) ? d2 : []);
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Tạo đề thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Đề thi & Bài tập</h1>
          <p className="text-sm text-gray-600">Tạo và quản lý đề thi, ngân hàng câu hỏi và lịch làm bài.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tạo yêu cầu tạo đề</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Chọn ma trận</label>
                <select className="w-full rounded-lg border px-3 py-2 mt-1" value={selectedMatrix ?? ''} onChange={(e) => setSelectedMatrix(e.target.value || null)}>
                  <option value="">-- Chọn ma trận --</option>
                  {matrices.map((m) => (
                    <option key={m.id} value={m.id}>{m.name ?? m.id}</option>
                  ))}
                </select>
              </div>

              <div>
                <Input label="Giá (VND)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateRequest} disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</Button>
              </div>

              {error && <p className="text-red-500">{error}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu tạo đề của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 && <p className="text-gray-600">Bạn chưa có yêu cầu nào</p>}

            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.examRequestId} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.matrixName ?? r.matrixId ?? r.examRequestId}</div>
                    <div className="text-sm text-gray-500">Trạng thái: {r.status ?? '—'}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleGenerate(r.examRequestId)}>Tạo đề</Button>
                    <Button onClick={() => window.alert('Xem chi tiết - chưa triển khai')}>Chi tiết</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default ExamsPage;
