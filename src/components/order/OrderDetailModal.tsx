import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Package, 
  Calendar, 
  CreditCard, 
  FileText,
  Loader2,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { orderService } from '@/services/order/orderService';
import type { Order } from '@/types/order.types';
import toast from 'react-hot-toast';

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order detail:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Chờ thanh toán':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Đã hủy':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Chờ thanh toán':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Đã hủy':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6" />
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
              </div>
            ) : order ? (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  {order.paymentTransactionId && (
                    <div className="bg-white/50 rounded-lg p-3 text-sm">
                      <span className="text-gray-600">Mã giao dịch: </span>
                      <span className="font-mono font-medium text-gray-900">
                        {order.paymentTransactionId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Sản phẩm ({order.orderDetails.length})
                  </h4>
                  <div className="space-y-3">
                    {order.orderDetails.map((detail) => (
                      <div
                        key={detail.orderDetailId}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">
                            {detail.templateName}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {new Date(detail.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {detail.subtotal.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tổng tiền hàng</span>
                      <span className="font-medium text-gray-900">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Tổng thanh toán</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {order.totalAmount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                    {order.paymentDate && (
                      <div className="flex items-center justify-between text-sm pt-2">
                        <span className="text-gray-600">Ngày thanh toán</span>
                        <span className="font-medium text-gray-900">
                          {new Date(order.paymentDate).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Ghi chú
                    </h4>
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Lịch sử đơn hàng</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 rounded-full p-2">
                        <Package className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Đơn hàng được tạo</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {order.paymentDate && (
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Thanh toán thành công</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.paymentDate).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
