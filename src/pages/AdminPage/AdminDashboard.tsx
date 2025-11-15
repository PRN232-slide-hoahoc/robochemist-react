import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Tổng quan Admin
        </h1>
        <p className="text-slate-600 mt-1">
          Chào mừng bạn đến với Admin Portal
        </p>
      </div>

      {/* Stats Grid - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Tổng người dùng</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
              <p className="text-sm text-green-600 mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0%</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Templates</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
              <p className="text-sm text-green-600 mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0%</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Đơn hàng</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
              <p className="text-sm text-green-600 mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0%</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Doanh thu</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0đ</p>
              <p className="text-sm text-green-600 mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0%</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
