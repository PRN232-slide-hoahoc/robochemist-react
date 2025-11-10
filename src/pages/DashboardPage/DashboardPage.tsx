import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { axiosInstance } from '@/services/api/axios.config';
import { endpoints } from '@/services/api/endpoints';
import { walletService } from '@/services/wallet/walletService';

type ExamRequest = { examRequestId: string; status?: string; createdAt?: string };

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [templatesCount, setTemplatesCount] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [recentExamRequests, setRecentExamRequests] = useState<ExamRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Templates - try to get a paged list and count
        const tResp = await axiosInstance.get(endpoints.TEMPLATE.TEMPLATES, { params: { PageNumber: 1, PageSize: 1 } });
        const totalTemplates = tResp.data?.data?.totalCount ?? (Array.isArray(tResp.data) ? tResp.data.length : null);
        setTemplatesCount(typeof totalTemplates === 'number' ? totalTemplates : null);

        // Wallet balance
        try {
          const balance = await walletService.getBalance();
          setWalletBalance(balance?.balance ?? null);
        } catch (wErr) {
          // ignore wallet error (may be unauthorized for some users)
          console.warn('Wallet fetch error', wErr);
          setWalletBalance(null);
        }

        // Recent exam requests for this user (if user id exists)
        if (user?.id) {
          const eResp = await axiosInstance.get(endpoints.EXAM.REQUEST_BY_USER(user.id));
          const list = eResp.data?.data ?? [];
          setRecentExamRequests(Array.isArray(list) ? list.slice(0, 5) : []);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <Container className="py-12">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Vui lòng đăng nhập</h1>
            <p className="text-gray-600 dark:text-gray-400">Bạn cần đăng nhập để truy cập trang này</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chào mừng, {user?.fullname}!</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Tổng quan nhanh về tài khoản và các dịch vụ</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Templates</p>
                <p className="mt-2 text-3xl font-bold text-primary-600">{templatesCount ?? '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Số dư ví</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{walletBalance != null ? `${walletBalance}` : '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yêu cầu tạo đề (gần đây)</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{recentExamRequests.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trạng thái hệ thống</p>
                <p className="mt-2 text-3xl font-bold text-orange-600">Online</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu tạo đề gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p>Đang tải...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && recentExamRequests.length === 0 && <p className="text-gray-600">Không có yêu cầu nào</p>}

              <ul className="mt-4 space-y-3">
                {recentExamRequests.map((r) => (
                  <li key={r.examRequestId} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Yêu cầu {r.examRequestId}</div>
                      <div className="text-sm text-gray-500">{r.status ?? '—'}</div>
                    </div>
                    <div className="text-sm text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};

