import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  LogOut,
  User,
  Menu,
  X,
  ChevronLeft,
  HelpCircle,
  BookOpen,
  Presentation,
  Wallet,
} from 'lucide-react';
import { useAuthStore } from '@/store';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    icon: FileText,
    label: 'Quản lý Template',
    path: '/staff/templates',
  },
  {
    icon: ShoppingCart,
    label: 'Quản lý Đơn hàng',
    path: '/staff/orders',
  },
  {
    icon: HelpCircle,
    label: 'Quản lý Câu hỏi',
    path: '/staff/questions',
  },
  {
    icon: BookOpen,
    label: 'Nội dung Bài học',
    path: '/staff/syllabuses',
  },
  {
    icon: Presentation,
    label: 'Quản lý Slides',
    path: '/staff/slides',
  },
  {
    icon: Wallet,
    label: 'Quản lý Giao dịch',
    path: '/staff/transactions',
  },
];

export const StaffLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white border-r border-slate-200 shadow-sm"
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RC</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">RoboChemist</h1>
                  <p className="text-xs text-slate-500">Staff Portal</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-200 p-3">
          <div
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg bg-slate-50 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.fullname || 'Staff User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={handleLogout}
            className={`mt-2 w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm"
                >
                  Đăng xuất
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RC</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">RoboChemist</h1>
                    <p className="text-xs text-slate-500">Staff Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Mobile User Profile */}
              <div className="border-t border-slate-200 p-3">
                <div className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user?.fullname || 'Staff User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Đăng xuất</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Mobile */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">RC</span>
            </div>
            <span className="text-sm font-bold text-slate-900">RoboChemist</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
