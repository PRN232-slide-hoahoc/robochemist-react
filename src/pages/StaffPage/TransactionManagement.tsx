import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { walletService } from '@/services/wallet/walletService';
import type { Transaction } from '@/types/wallet.type';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

export const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('all');
  const [referenceTypeFilter, setReferenceTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await walletService.getAllTransactions();
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Không thể tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.userName && transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchTransactionType = true;
    if (transactionTypeFilter !== 'all') {
      matchTransactionType = transaction.transactionType === transactionTypeFilter;
    }
    
    let matchReferenceType = true;
    if (referenceTypeFilter !== 'all') {
      matchReferenceType = transaction.transactionType === 'Thanh toán' && transaction.referenceType === referenceTypeFilter;
    }

    let matchStatus = true;
    if (statusFilter !== 'all') {
      matchStatus = transaction.status === statusFilter;
    }
    
    return matchesSearch && matchTransactionType && matchReferenceType && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, transactionTypeFilter, referenceTypeFilter, statusFilter]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Đợi xử lí':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Thất bại':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'Nạp tiền':
        return 'text-green-600';
      case 'Thanh toán':
        return 'text-blue-600';
      case 'Hoàn tiền':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const stats = {
    totalTransactions: transactions.length,
    totalDeposits: transactions.filter(t => t.transactionType === 'Nạp tiền').length,
    totalPayments: transactions.filter(t => t.transactionType === 'Thanh toán').length,
    totalRefunds: transactions.filter(t => t.transactionType === 'Hoàn tiền').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Quản lý Giao dịch
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý và theo dõi tất cả giao dịch trong hệ thống
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Tổng số giao dịch</span>
            <Wallet className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalTransactions}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Nạp tiền</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.totalDeposits}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Thanh toán</span>
            <TrendingDown className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPayments}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Hoàn tiền</span>
            <RefreshCw className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalRefunds}</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Bộ lọc</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã GD hoặc Tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Transaction Type Filter */}
          <select
            value={transactionTypeFilter}
            onChange={(e) => {
              setTransactionTypeFilter(e.target.value);
              if (e.target.value !== 'all' && e.target.value !== 'Thanh toán') {
                setReferenceTypeFilter('all');
              }
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả loại</option>
            <option value="Nạp tiền">Nạp tiền</option>
            <option value="Thanh toán">Thanh toán</option>
            <option value="Hoàn tiền">Hoàn tiền</option>
          </select>

          {/* Reference Type Filter */}
          {(transactionTypeFilter === 'all' || transactionTypeFilter === 'Thanh toán') && (
            <select
              value={referenceTypeFilter}
              onChange={(e) => setReferenceTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả dịch vụ</option>
              <option value="Tạo slide">Tạo slide</option>
              <option value="Tạo đề thi">Tạo đề thi</option>
              <option value="Mua template">Mua template</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đợi xử lí">Đợi xử lí</option>
            <option value="Thất bại">Thất bại</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Không có giao dịch nào</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Mã GD
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Người dùng
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Loại
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Dịch vụ
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Số tiền
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Phương thức
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.transactionId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">
                        {transaction.transactionId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">
                        {transaction.userName || transaction.userId.slice(0, 8) + '...'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getTransactionTypeColor(transaction.transactionType)}`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {transaction.transactionType === 'Thanh toán' && transaction.referenceType ? (
                        <span className="text-sm text-slate-600">
                          {transaction.referenceType}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${
                        transaction.transactionType === 'Nạp tiền' || transaction.transactionType === 'Hoàn tiền'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.transactionType === 'Nạp tiền' || transaction.transactionType === 'Hoàn tiền' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {transaction.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(transaction.createAt)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-slate-600">
              Hiển thị <span className="font-semibold text-slate-900">{startIndex + 1}</span> - <span className="font-semibold text-slate-900">{Math.min(endIndex, filteredTransactions.length)}</span> trong tổng số <span className="font-semibold text-slate-900">{filteredTransactions.length}</span> giao dịch
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
