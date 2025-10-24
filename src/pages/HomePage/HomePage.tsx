import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
            Chào mừng đến với RoboChemist
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Nền tảng quản lý và học tập hóa học hiện đại
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card hover>
            <CardHeader>
              <CardTitle>🧪 Thí nghiệm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Khám phá các thí nghiệm hóa học thú vị với hướng dẫn chi tiết
              </p>
              <Button variant="outline" fullWidth>
                Xem thêm
              </Button>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>📚 Bài giảng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Học tập với các bài giảng được thiết kế chuyên nghiệp
              </p>
              <Button variant="outline" fullWidth>
                Xem thêm
              </Button>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>📝 Bài kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Kiểm tra kiến thức với các bài tập và đề thi
              </p>
              <Button variant="outline" fullWidth>
                Xem thêm
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
            Bắt đầu ngay
          </Button>
        </div>
      </Container>
    </Layout>
  );
};

