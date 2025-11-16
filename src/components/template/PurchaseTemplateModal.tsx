import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, Check, AlertCircle, Loader2, Star } from 'lucide-react';
import { walletService } from '@/services/wallet/walletService';
import { templateService } from '@/services/template/templateService';
import type { Template, UserTemplate } from '@/types/template.types';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

interface PurchaseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | UserTemplate;
  onPurchaseSuccess?: () => void;
}

export const PurchaseTemplateModal: React.FC<PurchaseTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onPurchaseSuccess,
}) => {
  const { user } = useAuthStore();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [purchaseStep, setPurchaseStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');

  useEffect(() => {
    if (isOpen) {
      fetchWalletBalance();
      setPurchaseStep('confirm');
    }
  }, [isOpen]);

  const fetchWalletBalance = async () => {
    try {
      setLoadingBalance(true);
      const balance = await walletService.getBalance();
      setWalletBalance(balance.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Không thể tải số dư ví');
    } finally {
      setLoadingBalance(false);
    }
  };

  const handlePurchase = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để mua template');
      return;
    }

    if (walletBalance < template.price) {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền vào ví!');
      return;
    }

    try {
      setLoading(true);
      setPurchaseStep('processing');

      // Step 1: Create payment transaction
      const paymentPayload = {
        userId: user.id,
        amount: template.price,
        referenceId: template.templateId,
        referenceType: 'TEMPLATE_PURCHASE',
        description: `Mua template: ${template.templateName}`,
      };

      const paymentResult = await walletService.createWalletPayment(paymentPayload);
      
      if (!paymentResult || paymentResult.status !== 'Completed') {
        throw new Error('Thanh toán không thành công');
      }

      // Step 2: Grant template access
      const grantAccessPayload = {
        templateId: template.templateId,
      };

      await templateService.grantTemplateAccess(grantAccessPayload);

      // Success
      setPurchaseStep('success');
      toast.success('Mua template thành công!');
      
      // Refresh balance
      await fetchWalletBalance();

      // Call success callback after a short delay
      setTimeout(() => {
        onPurchaseSuccess?.();
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Purchase error:', error);
      setPurchaseStep('error');
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi mua template');
    } finally {
      setLoading(false);
    }
  };

  const hasEnoughBalance = walletBalance >= template.price;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Mua Template
              </h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {purchaseStep === 'confirm' && (
              <>
                {/* Template Info */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500 rounded-lg p-2">
                      <Star className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{template.templateName}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{template.slideCount} slides</span>
                        <span className="text-xl font-bold text-amber-600">
                          {template.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Số dư ví
                    </span>
                    {loadingBalance ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                    ) : (
                      <span className={`text-lg font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                        {walletBalance.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                  
                  {!loadingBalance && !hasEnoughBalance && (
                    <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800 font-medium mb-1">Số dư không đủ</p>
                        <p className="text-xs text-red-700">
                          Bạn cần thêm {(template.price - walletBalance).toLocaleString('vi-VN')}đ để mua template này
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Giá template</span>
                    <span className="font-medium">{template.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {!loadingBalance && (
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Số dư sau khi mua</span>
                      <span className={`font-medium ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                        {(walletBalance - template.price).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={loading || loadingBalance || !hasEnoughBalance}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Xác nhận mua'
                    )}
                  </button>
                </div>
              </>
            )}

            {purchaseStep === 'processing' && (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 animate-spin text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Đang xử lý giao dịch...</h3>
                <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
              </div>
            )}

            {purchaseStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mua template thành công!</h3>
                <p className="text-gray-600">Template đã được thêm vào tài khoản của bạn</p>
              </div>
            )}

            {purchaseStep === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Giao dịch thất bại</h3>
                <p className="text-gray-600 mb-6">Có lỗi xảy ra trong quá trình thanh toán</p>
                <button
                  onClick={() => setPurchaseStep('confirm')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
