import React, { useEffect, useState } from 'react';
import { walletService } from '@/services/wallet/walletService';
import { Button } from '@/components/ui/Button';
import { WalletDto} from '@/types/wallet.type';



export const BalanceBox: React.FC = () => {
  const [balance, setBalance] = useState<WalletDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.getWallet();
      setBalance(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể tải số dư');
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Đang tải số dư...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchBalance} variant="outline" size="sm">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Số dư ví</h3>
        <Button onClick={fetchBalance} variant="outline" size="sm">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Làm mới
        </Button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <p className="text-sm opacity-90 mb-2">Số dư khả dụng</p>
        <p className="text-3xl font-bold">
          {balance ? formatCurrency(balance.balance) : '0 ₫'}
        </p>
        {balance?.updateAt && (
          <p className="text-xs opacity-75 mt-3">
            Cập nhật: {new Date(balance.updateAt).toLocaleString('vi-VN')}
          </p>
        )}
      </div>
    </div>
  );
};