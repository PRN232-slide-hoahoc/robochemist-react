import { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/services/api/axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';
import { ExamService } from '@/services/exam/examService';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  name: string;
  gradeId: string;
  gradeName: string;
}

interface MatrixRow {
  id: string; // temporary ID for UI
  topicId: string;
  topicName: string;
  nhanBiet: number;
  thongHieu: number;
  vanDung: number;
  vanDungCao: number;
  total: number;
}

export const CreateMatrixPage = () => {
  const navigate = useNavigate();
  const [matrixName, setMatrixName] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [rows, setRows] = useState<MatrixRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [showTopicSelect, setShowTopicSelect] = useState(false);

  // Fetch topics from Slides Service - only once
  useEffect(() => {
    let isMounted = true;
    
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.SLIDES.TOPICS);
        const data = response.data?.data ?? response.data;
        
        if (isMounted && Array.isArray(data)) {
          setTopics(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            gradeId: t.gradeId,
            gradeName: t.gradeName || '',
          })));
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error loading topics:', err);
          toast.error('Không thể tải danh sách chủ đề');
        }
      } finally {
        if (isMounted) {
          setLoadingTopics(false);
        }
      }
    };

    fetchTopics();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate total for a row
  const calculateRowTotal = (row: MatrixRow): number => {
    return row.nhanBiet + row.thongHieu + row.vanDung + row.vanDungCao;
  };

  // Calculate column totals - memoized to avoid recalculation on every render
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => ({
        nhanBiet: acc.nhanBiet + row.nhanBiet,
        thongHieu: acc.thongHieu + row.thongHieu,
        vanDung: acc.vanDung + row.vanDung,
        vanDungCao: acc.vanDungCao + row.vanDungCao,
        total: acc.total + row.total,
      }),
      { nhanBiet: 0, thongHieu: 0, vanDung: 0, vanDungCao: 0, total: 0 }
    );
  }, [rows]);

  // Add new row - memoized to prevent unnecessary re-renders
  const addRow = useCallback((topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;

    // Check if topic already added
    if (rows.some((r) => r.topicId === topicId)) {
      toast.error('Chủ đề này đã được thêm vào ma trận');
      return;
    }

    const newRow: MatrixRow = {
      id: `temp-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      nhanBiet: 0,
      thongHieu: 0,
      vanDung: 0,
      vanDungCao: 0,
      total: 0,
    };

    setRows((prev) => [...prev, newRow]);
    setShowTopicSelect(false);
  }, [topics, rows]);

  // Update row value - memoized
  const updateRow = useCallback((rowId: string, field: keyof MatrixRow, value: number) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const updated = { ...row, [field]: Math.max(0, value) };
          updated.total = calculateRowTotal(updated);
          return updated;
        }
        return row;
      })
    );
  }, []);

  // Remove row - memoized
  const removeRow = useCallback((rowId: string) => {
    setRows((prevRows) => prevRows.filter((r) => r.id !== rowId));
  }, []);

  // Create matrix
  const handleCreateMatrix = useCallback(async () => {
    if (!matrixName.trim()) {
      toast.error('Vui lòng nhập tên ma trận');
      return;
    }

    if (rows.length === 0) {
      toast.error('Vui lòng thêm ít nhất một chủ đề');
      return;
    }

    if (totals.total === 0) {
      toast.error('Vui lòng nhập số lượng câu hỏi');
      return;
    }

    setLoading(true);

    try {
      const matrixDetails: any[] = [];

      // Build matrix details for each row and each level
      rows.forEach((row) => {
        const levels = [
          { level: 'NhanBiet', count: row.nhanBiet },
          { level: 'ThongHieu', count: row.thongHieu },
          { level: 'VanDung', count: row.vanDung },
          { level: 'VanDungCao', count: row.vanDungCao },
        ];

        levels.forEach(({ level, count }) => {
          if (count > 0) {
            matrixDetails.push({
              TopicId: row.topicId,
              QuestionType: 'MultipleChoice',
              Level: level,
              QuestionCount: count,
            });
          }
        });
      });

      const payload = {
        Name: matrixName,
        TotalQuestion: totals.total,
        MatrixDetails: matrixDetails,
      };

      await axiosInstance.post(API_ENDPOINTS.EXAM.MATRICES_BASE, payload);
      
      // Clear matrices cache to force refresh on ExamsPage
      ExamService.clearMatricesCache();
      
      toast.success('Tạo ma trận thành công!');
      navigate('/exams');
    } catch (err: any) {
      console.error('Error creating matrix:', err);
      toast.error(err?.response?.data?.message || 'Không thể tạo ma trận');
    } finally {
      setLoading(false);
    }
  }, [matrixName, rows, totals, navigate]);

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Tạo Ma Trận Đề Thi</h1>
          <p className="text-sm text-gray-600">Thiết lập phân bổ câu hỏi theo chủ đề và mức độ</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin ma trận</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="Tên ma trận"
              placeholder="VD: Ma trận đề kiểm tra giữa kỳ Hóa 10"
              value={matrixName}
              onChange={(e) => setMatrixName(e.target.value)}
              disabled={loading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bổ câu hỏi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left min-w-[200px]">Tên chủ đề</th>
                    <th className="border px-4 py-2 text-center w-32">Nhận biết</th>
                    <th className="border px-4 py-2 text-center w-32">Thông hiểu</th>
                    <th className="border px-4 py-2 text-center w-32">Vận dụng</th>
                    <th className="border px-4 py-2 text-center w-32">Vận dụng cao</th>
                    <th className="border px-4 py-2 text-center w-32 bg-blue-50">Tổng số câu</th>
                    <th className="border px-4 py-2 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 font-medium">{row.topicName}</td>
                      <td className="border px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full px-2 py-1 border rounded text-center"
                          value={row.nhanBiet}
                          onChange={(e) => updateRow(row.id, 'nhanBiet', parseInt(e.target.value) || 0)}
                          disabled={loading}
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full px-2 py-1 border rounded text-center"
                          value={row.thongHieu}
                          onChange={(e) => updateRow(row.id, 'thongHieu', parseInt(e.target.value) || 0)}
                          disabled={loading}
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full px-2 py-1 border rounded text-center"
                          value={row.vanDung}
                          onChange={(e) => updateRow(row.id, 'vanDung', parseInt(e.target.value) || 0)}
                          disabled={loading}
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full px-2 py-1 border rounded text-center"
                          value={row.vanDungCao}
                          onChange={(e) => updateRow(row.id, 'vanDungCao', parseInt(e.target.value) || 0)}
                          disabled={loading}
                        />
                      </td>
                      <td className="border px-4 py-2 text-center font-bold bg-blue-50">
                        {row.total}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-red-600 hover:text-red-800 font-bold"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Add new row button */}
                  {showTopicSelect ? (
                    <tr>
                      <td className="border px-4 py-2" colSpan={7}>
                        <div className="flex gap-2">
                          <select
                            className="flex-1 px-3 py-2 border rounded"
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                addRow(e.target.value);
                                e.target.value = ''; // Reset after selection
                              }
                            }}
                            disabled={loadingTopics}
                          >
                            <option value="">-- Chọn chủ đề --</option>
                            {topics
                              .filter((t) => !rows.some((r) => r.topicId === t.id))
                              .map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                  {topic.name} {topic.gradeName && `(${topic.gradeName})`}
                                </option>
                              ))}
                          </select>
                          <Button variant="outline" onClick={() => setShowTopicSelect(false)}>
                            Hủy
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="border px-4 py-2 text-center" colSpan={7}>
                        <button
                          onClick={() => setShowTopicSelect(true)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-2xl"
                          disabled={loading || loadingTopics}
                        >
                          + Thêm chủ đề
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* Total row */}
                  {rows.length > 0 && (
                    <tr className="bg-gray-100 font-bold">
                      <td className="border px-4 py-2">TỔNG</td>
                      <td className="border px-4 py-2 text-center">{totals.nhanBiet}</td>
                      <td className="border px-4 py-2 text-center">{totals.thongHieu}</td>
                      <td className="border px-4 py-2 text-center">{totals.vanDung}</td>
                      <td className="border px-4 py-2 text-center">{totals.vanDungCao}</td>
                      <td className="border px-4 py-2 text-center bg-blue-100">{totals.total}</td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreateMatrix} disabled={loading || rows.length === 0}>
                {loading ? 'Đang tạo...' : 'Tạo ma trận'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/exams')} disabled={loading}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default CreateMatrixPage;
