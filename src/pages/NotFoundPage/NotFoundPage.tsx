import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <Container className="py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-9xl font-bold text-primary-600">404</h1>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Không tìm thấy trang
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Về trang chủ
          </Button>
        </div>
      </Container>
    </Layout>
  );
};

