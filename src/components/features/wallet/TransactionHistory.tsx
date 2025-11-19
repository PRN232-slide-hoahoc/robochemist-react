import React, { useEffect, useState } from 'react';
import { walletService } from '@/services/wallet/walletService';
import { Transaction } from '@/types/wallet.type';
import { Button } from '@/components/ui/Button';

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.getAllTransactions();
      setTransactions(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể tải lịch sử giao dịch');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'Hoàn thành': { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
      'Đợi xử lí': { label: 'Đợi xử lí', className: 'bg-yellow-100 text-yellow-800' },
      'Thất bại': { label: 'Thất bại', className: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTransactionTypeInfo = (type: string) => {
    const typeMap: Record<string, { label: string; icon: string; color: string }> = {
      'Nạp tiền': { label: 'Nạp tiền', icon: '↓', color: 'text-green-600' },
      'Rút tiền': { label: 'Rút tiền', icon: '↑', color: 'text-red-600' },
      'Thanh toán': { label: 'Thanh toán', icon: '→', color: 'text-blue-600' },
      'Hoàn tiền': { label: 'Hoàn tiền', icon: '←', color: 'text-purple-600' },
    };
    return typeMap[type] || { label: type, icon: '•', color: 'text-gray-600' };
  };

  const getTransactionDetails = (transaction: Transaction) => {
    if (transaction.referenceId && transaction.transactionType === 'Thanh toán') {
      return (
        <p className="text-xs text-green-600 mt-1">
          {transaction.referenceType}
        </p>
      );
    }
    
    if (transaction.description && transaction.transactionType === 'Hoàn tiền') {
      return (
        <p className="text-xs text-purple-600 mt-1">
          {transaction.description}
        </p>
      );
    }
    
    return null;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.transactionType === filter;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Đang tải lịch sử giao dịch...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchTransactions} variant="outline" size="sm">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
        <Button onClick={fetchTransactions} variant="outline" size="sm">
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

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('Nạp tiền')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'Nạp tiền'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Nạp tiền
        </button>
        <button
          onClick={() => setFilter('Thanh toán')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'Thanh toán'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Thanh toán
        </button>
        <button
          onClick={() => setFilter('Hoàn tiền')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'Hoàn tiền'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Hoàn tiền
        </button>
      </div>

      {/* Transaction list */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>Không có giao dịch nào</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const typeInfo = getTransactionTypeInfo(transaction.transactionType);
            return (
              <div
                key={transaction.transactionId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{typeInfo.label} </p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.createAt)}</p>
                      {getTransactionDetails(transaction)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${typeInfo.color}`}>
                      {transaction.transactionType === 'Nạp tiền' || transaction.transactionType === 'Hoàn tiền' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-2 border-t">
          Tổng số: {filteredTransactions.length} giao dịch
        </div>
      )}
    </div>
  );
};