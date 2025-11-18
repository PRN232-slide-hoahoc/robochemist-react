import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants/routes';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primary-600">RoboChemist</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
                Trang chủ
              </a>
              <a href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
                Dashboard
              </a>
              <a href={ROUTES.SLIDES} className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
                Slides
              </a>
              <a href={ROUTES.TEMPLATES} className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
                Templates
              </a>
              <a href={ROUTES.EXAMS} className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
                Đề thi
              </a>
              <a href={ROUTES.WALLET} className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
                Ví
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.fullname}
                </span>
                <Button size="sm" variant="ghost" onClick={() => window.location.href = ROUTES.WALLET}>
                  Ví
                </Button>
                <Button size="sm" variant="outline" onClick={logout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => window.location.href = '/login'}>
                  Đăng nhập
                </Button>
                <Button size="sm" onClick={() => window.location.href = '/register'}>
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

