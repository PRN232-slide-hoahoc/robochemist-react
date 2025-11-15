import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Package,
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Quản lý Đơn hàng
        </h1>
        <p className="text-slate-600 mt-1">
          Quản lý và theo dõi tất cả đơn hàng trong hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Đang xử lý</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Hoàn thành</p>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Đã hủy</p>
              <p className="text-3xl font-bold text-red-600 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-12"
      >
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Tính năng đang phát triển
          </h2>
          <p className="text-slate-600 mb-6">
            Trang quản lý đơn hàng đang được phát triển và sẽ sớm ra mắt. 
            Vui lòng quay lại sau để trải nghiệm đầy đủ tính năng.
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium">
            <AlertCircle className="w-5 h-5" />
            <span>Coming Soon</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
