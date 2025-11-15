import React, { useState } from 'react';
import { walletService } from '@/services/wallet/walletService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { u } from 'framer-motion/client';

export const DepositForm: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const user = useAuthStore((state) => state.user);

  const predefinedAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
    setError(null);
    setSuccess(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Vui lòng đăng nhập để nạp tiền');
      return;
    }

    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (numAmount < 10000) {
      setError('Số tiền nạp tối thiểu là 10,000đ');
      return;
    }

    if (numAmount > 50000000) {
      setError('Số tiền nạp tối đa là 50,000,000đ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

        console.log(user.id,numAmount);

      const depositUrl = await walletService.createDepositUrl({
        userId: user.id,
        amount: numAmount,
      });

      if (depositUrl) {
        setSuccess('Đang chuyển đến trang thanh toán...');
        // Redirect to payment URL
        window.location.href = depositUrl;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể tạo yêu cầu nạp tiền');
      console.error('Error creating deposit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nạp tiền vào ví</h3>
        <p className="text-sm text-gray-500">Chọn hoặc nhập số tiền muốn nạp</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Predefined amounts */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Chọn nhanh
          </label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                onClick={() => handlePredefinedAmount(presetAmount)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  amount === presetAmount.toString()
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {formatCurrency(presetAmount)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount input */}
        <div>
          <Input
            label="Hoặc nhập số tiền khác"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Nhập số tiền..."
            fullWidth
            error={error || undefined}
          />
          <p className="text-xs text-gray-500 mt-1">
            Tối thiểu: 10,000đ - Tối đa: 50,000,000đ
          </p>
        </div>

        {/* Amount preview */}
        {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Số tiền sẽ nạp:</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(parseFloat(amount))}
            </p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          fullWidth
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nạp tiền
            </>
          )}
        </Button>
      </form>
    </div>
  );
};