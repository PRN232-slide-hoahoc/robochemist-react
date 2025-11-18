import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
// Card UI not used on Home page; kept in other pages
import { Button } from '@/components/ui/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container className="py-12">
        {/* Creative Hero / Banner - keeps existing page content below */}
        <div className="mb-8">
          <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-50 to-rose-50 dark:from-slate-800 dark:to-slate-900 border border-gray-100/40 dark:border-gray-700/30 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">RoboChemist — Học nhanh, dạy dễ</h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 max-w-prose">
                  Công cụ hỗ trợ giảng dạy: soạn slide nhanh, tạo đề thi tự động và chia sẻ tài nguyên cho học sinh. Dành cho giáo viên và sinh viên muốn học theo cách thực hành.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => navigate('/dashboard')}>Bắt đầu</Button>
                  <Button variant="outline" onClick={() => navigate('/templates')}>Duyệt templates</Button>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                <div className="rounded-lg bg-white/80 dark:bg-gray-800/60 p-3 text-center">
                  <div className="text-indigo-500 mb-2">🔬</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Thực hành</div>
                  <div className="text-xs text-gray-500">Bài tập & mô phỏng</div>
                </div>

                <div className="rounded-lg bg-white/80 dark:bg-gray-800/60 p-3 text-center">
                  <div className="text-rose-500 mb-2">🧪</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Đề thi tự động</div>
                  <div className="text-xs text-gray-500">Tạo đa dạng kiểu câu hỏi</div>
                </div>

                <div className="rounded-lg bg-white/80 dark:bg-gray-800/60 p-3 text-center">
                  <div className="text-green-500 mb-2">📤</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Chia sẻ</div>
                  <div className="text-xs text-gray-500">Giao tài nguyên cho lớp</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promotional feature cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg p-4 bg-white/90 dark:bg-gray-800/60 border border-gray-100/40">
            <h3 className="font-semibold text-gray-900 dark:text-white">Templates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Duyệt, tải xuống và tải template lên để soạn slide nhanh.</p>
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/templates')}>Mở kho templates</Button>
            </div>
          </div>

          <div className="rounded-lg p-4 bg-white/90 dark:bg-gray-800/60 border border-gray-100/40">
            <h3 className="font-semibold text-gray-900 dark:text-white">Slides</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Soạn slide, sử dụng template và thêm ghi chú giảng dạy.</p>
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/slides')}>Soạn slide</Button>
            </div>
          </div>

          <div className="rounded-lg p-4 bg-white/90 dark:bg-gray-800/60 border border-gray-100/40">
            <h3 className="font-semibold text-gray-900 dark:text-white">Đề thi & Bài tập</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tạo đề thi tự động và quản lý ngân hàng câu hỏi.</p>
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/exams')}>Tạo đề</Button>
            </div>
          </div>
        </div>

        
      </Container>
    </Layout>
  );
};

