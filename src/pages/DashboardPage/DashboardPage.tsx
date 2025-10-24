import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <Container className="py-12">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Vui lòng đăng nhập
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bạn cần đăng nhập để truy cập trang này
            </p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chào mừng, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Đây là trang dashboard của bạn
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tổng bài học
                </p>
                <p className="mt-2 text-3xl font-bold text-primary-600">24</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đã hoàn thành
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">12</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đang học
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">8</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Điểm trung bình
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-600">8.5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có hoạt động nào
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};

