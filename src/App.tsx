import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const WalletPage = lazy(() => import('@/pages/WalletPage').then(m => ({ default: m.WalletPage })));
const PaymentCallbackPage = lazy(() => import('@/pages/PaymentCallbackPage').then(m => ({ default: m.PaymentCallbackPage })));
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage/TemplatesPage').then(m => ({ default: m.TemplatesPage })));
const SlidesPage = lazy(() => import('@/pages/SlidesPage/SlidesPage').then(m => ({ default: m.SlidesPage })));
const ExamsPage = lazy(() => import('@/pages/ExamsPage/ExamsPage').then(m => ({ default: m.ExamsPage })));
const CreateMatrixPage = lazy(() => import('@/pages/CreateMatrixPage').then(m => ({ default: m.CreateMatrixPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Staff pages
const StaffDashboard = lazy(() => import('@/pages/StaffPage').then(m => ({ default: m.StaffDashboard })));
const TemplateManagement = lazy(() => import('@/pages/StaffPage').then(m => ({ default: m.TemplateManagement })));
const OrderManagement = lazy(() => import('@/pages/StaffPage').then(m => ({ default: m.OrderManagement })));
const QuestionManagement = lazy(() => import('@/pages/StaffPage').then(m => ({ default: m.QuestionManagement })));
const SyllabusManagement = lazy(() => import('@/pages/StaffPage').then(m => ({ default: m.SyllabusManagement })));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminDashboard })));
const AdminSlideManagement = lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminSlideManagement })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/slides" element={<SlidesPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/create-matrix" element={<CreateMatrixPage />} />
            
            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="templates" element={<TemplateManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="questions" element={<QuestionManagement />} />
              <Route path="syllabuses" element={<SyllabusManagement />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="slides" element={<AdminSlideManagement />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;

