import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  FileText,
  Grid3x3,
  List,
  X,
  Check,
  Star,
  Clock,
  Sparkles,
  Lock,
  Library,
  User,
  ShoppingCart,
  ShoppingBag,
  Calendar,
} from 'lucide-react';
import { templateService } from '@/services/template/templateService';
import { orderService } from '@/services/order/orderService';
import { useAuthStore } from '@/store/authStore';
import type { OrderSummary } from '@/types/order.types';
import type { UserTemplateResponse, Template } from '@/types/template.types';
import toast from 'react-hot-toast';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { PurchaseTemplateModal } from '@/components/template/PurchaseTemplateModal';

type TabType = 'all' | 'my' | 'orders';

export const TemplatesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [myTemplates, setMyTemplates] = useState<UserTemplateResponse[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<(Template | UserTemplateResponse)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | UserTemplateResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseTemplate, setPurchaseTemplate] = useState<Template | UserTemplateResponse | null>(null);
  const [ownedTemplateIds, setOwnedTemplateIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTemplates();
  }, [activeTab]);

  useEffect(() => {
    filterAndSortTemplates();
  }, [allTemplates, myTemplates, activeTab, searchTerm, selectedFilter, sortBy]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      if (activeTab === 'all') {
        // Fetch all active templates
        const result = await templateService.getTemplates({
          pageNumber: 1,
          pageSize: 1000,
          isActive: true,
        });
        setAllTemplates(result.items);
        
        // Also fetch owned templates to mark them
        try {
          const myTemplatesData = await templateService.getMyTemplates();
          const ownedIds = new Set(myTemplatesData.map(t => t.templateId));
          setOwnedTemplateIds(ownedIds);
        } catch (err) {
          // User might not be logged in, ignore error
          setOwnedTemplateIds(new Set());
        }
      } else if (activeTab === 'my') {
        // Fetch user templates (free + owned premium)
        const data = await templateService.getMyTemplates();
        setMyTemplates(data);
        // Track owned template IDs
        const ownedIds = new Set(data.map(t => t.templateId));
        setOwnedTemplateIds(ownedIds);
      } else if (activeTab === 'orders') {
        // Fetch user's purchase history
        try {
          if (user?.id) {
            const ordersData = await orderService.getUserOrders(user.id);
            // Filter only completed orders with templates
            const completedOrders = ordersData.filter(o => o.status === 'Hoàn thành');
            setOrders(completedOrders);
          } else {
            toast.error('Vui lòng đăng nhập để xem lịch sử mua hàng');
          }
        } catch (err) {
          toast.error('Không thể tải lịch sử mua hàng');
          console.error('Error fetching orders:', err);
        }
      }
    } catch (error: any) {
      toast.error('Không thể tải danh sách template');
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTemplates = () => {
    const templates = activeTab === 'all' ? allTemplates : myTemplates;
    let filtered = [...templates];

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter === 'free') {
      filtered = filtered.filter((t) => !t.isPremium);
    } else if (selectedFilter === 'premium') {
      filtered = filtered.filter((t) => t.isPremium);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'name':
          return a.templateName.localeCompare(b.templateName);
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  };

  const handleDownload = async (template: Template | UserTemplateResponse) => {
    try {
      const blob = await templateService.downloadTemplate(template.templateId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.templateName}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Tải template thành công!');
    } catch (error) {
      toast.error('Không thể tải template');
      console.error('Download error:', error);
    }
  };

  const handlePreview = async (template: Template | UserTemplateResponse) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
    setLoadingPreview(true);
    setPreviewUrl('');

    try {
      const url = await templateService.getPresignedUrl(template.templateId);
      setPreviewUrl(url);
    } catch (error: any) {
      toast.error('Không thể tải preview');
      console.error('Preview error:', error);
      setPreviewUrl('');
    } finally {
      setLoadingPreview(false);
    }
  };

  const isTemplateOwned = (templateId: string): boolean => {
    return ownedTemplateIds.has(templateId);
  };

  const handlePurchase = (template: Template | UserTemplateResponse) => {
    setPurchaseTemplate(template);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = async () => {
    // Add to owned templates immediately for better UX
    if (purchaseTemplate) {
      setOwnedTemplateIds(prev => new Set([...prev, purchaseTemplate.templateId]));
    }
    // Refresh templates after purchase
    await fetchTemplates();
  };

  return (
    <Layout>
      <Container>
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Template Library
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Khám phá bộ sưu tập Template chuyên nghiệp
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tải xuống template PowerPoint chất lượng cao được thiết kế riêng cho bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-2xl border-2 border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Library className="w-5 h-5" />
              Tất cả Templates
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'my'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              Template của tôi
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Lịch sử mua
            </button>
          </div>
        </div>

        {/* Step 1: Search & Filter - Only show for all and my tabs */}
        {activeTab !== 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 animate-fadeIn"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold shadow-lg">
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tìm kiếm và lọc</h2>
              <p className="text-gray-600">Tìm template phù hợp với nhu cầu của bạn</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm kiếm template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === 'all'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setSelectedFilter('free')}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === 'free'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  Miễn phí
                </button>
                <button
                  onClick={() => setSelectedFilter('premium')}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === 'premium'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-1" />
                  Premium
                </button>
              </div>
            </div>

            {/* Sort & View Mode */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="newest">
                    <Clock className="w-4 h-4 inline" /> Mới nhất
                  </option>
                  <option value="popular">Phổ biến</option>
                  <option value="name">Tên A-Z</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Purchase History - Only show for orders tab */}
        {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 animate-fadeIn"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold shadow-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lịch sử mua template</h2>
              <p className="text-gray-600">
                {orders.length} đơn hàng đã hoàn thành
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-primary-600 font-semibold">Đang tải lịch sử...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</p>
              <p className="text-gray-600">Các template bạn mua sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-medium">Mã đơn hàng</p>
                          <p className="text-white font-mono font-bold text-sm">
                            #{order.orderNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left side - Template info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {order.templateName || 'Template'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-primary-500" />
                              <span>
                                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-primary-500" />
                              <span>
                                {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium">Tổng tiền</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                          {order.totalAmount.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        )}

        {/* Step 2: Templates - Only show for all and my tabs */}
        {activeTab !== 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="animate-fadeIn"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold shadow-lg">
              2
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chọn template</h2>
              <p className="text-gray-600">
                {filteredTemplates.length} template có sẵn
              </p>
            </div>
          </div>

          {/* Templates Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-primary-600 font-semibold">Đang tải templates...</p>
              </div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy template nào</p>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.templateId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-600 p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-102"
                >
                  {/* Template Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-4 overflow-hidden">
                    {template.thumbnailUrl ? (
                      <img
                        src={template.thumbnailUrl}
                        alt={template.templateName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full flex items-center justify-center';
                            fallback.innerHTML = '<svg class="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-16 h-16 text-primary-300" />
                      </div>
                    )}

                    {template.isPremium && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Premium
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {template.templateName}
                  </h3>

                  {template.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-700 font-medium">
                      {template.slideCount} slides
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {template.downloadCount}
                    </span>
                  </div>

                  {template.isPremium && (
                    <div className="font-bold text-amber-600 mb-4">
                      {template.price.toLocaleString('vi-VN')}đ
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="flex-1 bg-white border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-xl font-semibold hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </button>
                    {/* Show download button for: 1) free templates, OR 2) premium templates in "My Templates" tab (already owned) */}
                    {(!template.isPremium || activeTab === 'my') && (
                      <button
                        onClick={() => handleDownload(template)}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Tải
                      </button>
                    )}
                    {/* Show buy button or owned badge for premium templates in "All Templates" tab */}
                    {template.isPremium && activeTab === 'all' && (
                      isTemplateOwned(template.templateId) ? (
                        <div className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-default">
                          <Check className="w-4 h-4" />
                          Đã có
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(template)}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Mua
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.templateId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-600 overflow-hidden transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="md:w-72 aspect-video bg-gradient-to-br from-primary-50 to-primary-100 relative flex-shrink-0">
                      {template.thumbnailUrl ? (
                        <img
                          src={template.thumbnailUrl}
                          alt={template.templateName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center';
                              fallback.innerHTML = '<svg class="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-16 h-16 text-primary-300" />
                        </div>
                      )}

                      {template.isPremium && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          Premium
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">
                        {template.templateName}
                      </h3>

                      {template.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-sm mb-4">
                        <span className="text-gray-700 font-medium">
                          {template.slideCount} slides
                        </span>
                        <span className="flex items-center gap-2 text-gray-600">
                          <Download className="w-4 h-4" />
                          {template.downloadCount} lượt tải
                        </span>
                        {template.isPremium && (
                          <span className="font-bold text-lg text-amber-600">
                            {template.price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePreview(template)}
                          className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all flex items-center gap-2"
                        >
                          <Eye className="w-5 h-5" />
                          Xem trước
                        </button>
                        {/* Show download button for: 1) free templates, OR 2) premium templates in "My Templates" tab (already owned) */}
                        {(!template.isPremium || activeTab === 'my') && (
                          <button
                            onClick={() => handleDownload(template)}
                            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                          >
                            <Download className="w-5 h-5" />
                            Tải xuống
                          </button>
                        )}
                        {/* Show buy button or owned badge for premium templates in "All Templates" tab */}
                        {template.isPremium && activeTab === 'all' && (
                          isTemplateOwned(template.templateId) ? (
                            <div className="px-6 py-2 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center gap-2 cursor-default">
                              <Check className="w-5 h-5" />
                              Đã sở hữu
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePurchase(template)}
                              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Mua ngay
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        )}
      </Container>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewTemplate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex-shrink-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{previewTemplate.templateName}</h2>
                      {previewTemplate.isPremium && (
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-current" />
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-primary-100">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {previewTemplate.slideCount} slides
                      </span>
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {previewTemplate.downloadCount} lượt tải
                      </span>
                      {previewTemplate.isPremium && (
                        <span className="text-yellow-300 font-bold text-lg">
                          {previewTemplate.price.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setPreviewTemplate(null);
                      setPreviewUrl('');
                    }}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden bg-gray-100 relative">
                {loadingPreview ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Đang tải preview...
                      </h3>
                      <p className="text-sm text-gray-600">
                        Vui lòng đợi trong giây lát
                      </p>
                    </div>
                  </div>
                ) : previewUrl ? (
                  <div className="w-full h-full relative">
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        previewUrl
                      )}`}
                      className="w-full h-full border-0"
                      title={`Preview: ${previewTemplate.templateName}`}
                    />
                    {previewTemplate.isPremium && (
                      <div className="absolute bottom-0 right-0">
                        <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl border-2 border-primary-200">
                          <Lock className="w-5 h-5 text-amber-600" />
                          Template Premium - Chỉ xem trước
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
                      <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        Không thể tải preview
                      </p>
                      <p className="text-gray-600">
                        Vui lòng thử lại sau
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      {purchaseTemplate && (
        <PurchaseTemplateModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setPurchaseTemplate(null);
          }}
          template={purchaseTemplate}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </Layout>
  );
};
