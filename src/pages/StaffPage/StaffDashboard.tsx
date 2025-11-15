import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Tổng quan
        </h1>
        <p className="text-slate-600 mt-1">
          Chào mừng bạn đến với Staff Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Người dùng</p>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Template gần đây</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Chưa có dữ liệu</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Đơn hàng gần đây</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Chưa có dữ liệu</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
            <FileText className="w-5 h-5" />
            <span>Thêm Template</span>
          </button>
          <button className="flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all duration-200">
            <ShoppingCart className="w-5 h-5" />
            <span>Xem Đơn hàng</span>
          </button>
          <button className="flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all duration-200">
            <Calendar className="w-5 h-5" />
            <span>Báo cáo</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
