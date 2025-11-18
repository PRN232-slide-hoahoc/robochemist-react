import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  FileText,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { templateService } from '@/services/template/templateService';
import type { Template, TemplateFilters } from '@/types/template.types';
import toast from 'react-hot-toast';

export const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters - Show all templates (active and inactive) for staff
  const [filters, setFilters] = useState<TemplateFilters>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
    sortBy: 'createdAt',
    sortDescending: true,
    isActive: undefined, // undefined = show all templates
  });

  // Upload form
  const [uploadData, setUploadData] = useState({
    templateName: '',
    description: '',
    slideCount: 0,
    isPremium: false,
    price: 0,
    file: null as File | null,
    thumbnailFile: null as File | null,
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // Use staff endpoint to get ALL templates (including inactive)
      const result = await templateService.getTemplatesForStaff(filters);
      setTemplates(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setCurrentPage(result.pageNumber);
    } catch (error: any) {
      toast.error('Không thể tải danh sách template');
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm,
      pageNumber: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      toast.error('Vui lòng chọn file template');
      return;
    }

    try {
      const loadingToast = toast.loading('Đang upload template...');
      
      await templateService.uploadTemplate({
        file: uploadData.file,
        thumbnailFile: uploadData.thumbnailFile || undefined,
        templateName: uploadData.templateName,
        description: uploadData.description,
        slideCount: uploadData.slideCount,
        isPremium: uploadData.isPremium,
        price: uploadData.price,
      });

      toast.success('Upload template thành công!', { id: loadingToast });
      setShowUploadModal(false);
      setUploadData({
        templateName: '',
        description: '',
        slideCount: 0,
        isPremium: false,
        price: 0,
        file: null,
        thumbnailFile: null,
      });
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload thất bại');
      console.error('Upload error:', error);
    }
  };

  const handleDownload = async (template: Template) => {
    try {
      const loadingToast = toast.loading('Đang tải xuống...');
      const blob = await templateService.downloadTemplate(template.templateId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.templateName}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Tải xuống thành công!', { id: loadingToast });
    } catch (error) {
      toast.error('Không thể tải xuống template');
      console.error('Download error:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setShowEditModal(true);
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTemplate) return;

    try {
      const loadingToast = toast.loading('Đang cập nhật template...');
      
      await templateService.updateTemplate(editingTemplate.templateId, {
        templateName: editingTemplate.templateName,
        description: editingTemplate.description,
        slideCount: editingTemplate.slideCount,
        isPremium: editingTemplate.isPremium,
        price: editingTemplate.price,
        isActive: editingTemplate.isActive,
      });

      toast.success('Cập nhật template thành công!', { id: loadingToast });
      setShowEditModal(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
      console.error('Update error:', error);
    }
  };

  const handleDelete = (template: Template) => {
    setDeletingTemplate(template);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingTemplate) return;

    try {
      const loadingToast = toast.loading('Đang vô hiệu hóa template...');
      
      await templateService.deleteTemplate(deletingTemplate.templateId);

      toast.success('Vô hiệu hóa template thành công!', { id: loadingToast });
      setShowDeleteConfirm(false);
      setDeletingTemplate(null);
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Vô hiệu hóa thất bại');
      console.error('Delete error:', error);
    }
  };

  const handlePreview = async (template: Template) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
    setLoadingPreview(true);
    
    try {
      // Fetch presigned URL from backend
      const url = await templateService.getPresignedUrl(template.templateId);
      setPreviewUrl(url);
    } catch (error) {
      toast.error('Không thể tạo URL preview');
      console.error('Preview URL error:', error);
      setPreviewUrl('');
    } finally {
      setLoadingPreview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Quản lý Template
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý và theo dõi tất cả template trong hệ thống
          </p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Thêm Template</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Tổng Template</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalCount}</p>
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
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Template Premium</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {templates.filter((t) => t.isPremium).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-700" />
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
              <p className="text-sm text-slate-600 font-medium">Template Miễn phí</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {templates.filter((t) => !t.isPremium).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter Group */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-slate-600 px-2 py-2">Trạng thái:</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, isActive: undefined, pageNumber: 1 }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filters.isActive === undefined
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả ({totalCount})
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, isActive: true, pageNumber: 1 }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.isActive === true
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ToggleRight className="w-4 h-4" />
                Hoạt động
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, isActive: false, pageNumber: 1 }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.isActive === false
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ToggleLeft className="w-4 h-4" />
                Vô hiệu hóa
              </button>
            </div>

            {/* Premium Filter Group */}
            <div className="flex flex-wrap gap-2 border-l border-slate-300 pl-3">
              <span className="text-sm font-medium text-slate-600 px-2 py-2">Loại:</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, isPremium: undefined, pageNumber: 1 }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filters.isPremium === undefined
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, isPremium: true, pageNumber: 1 }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.isPremium === true
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Premium
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, isPremium: false, pageNumber: 1 }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  filters.isPremium === false
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Miễn phí
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Tên Template
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Slides
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                      <span className="text-slate-600">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-600">
                    Không có template nào
                  </td>
                </tr>
              ) : (
                templates.map((template, index) => (
                  <motion.tr
                    key={template.templateId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {template.templateName}
                          </p>
                          {template.description && (
                            <p className="text-sm text-slate-500 truncate">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {template.slideCount}
                    </td>
                    <td className="px-6 py-4">
                      {template.isPremium ? (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-slate-900">
                            {formatPrice(template.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Miễn phí
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900">
                          {template.downloadCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {template.isActive ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <ToggleRight className="w-4 h-4" />
                          <span>Hoạt động</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <ToggleLeft className="w-4 h-4" />
                          <span>Tạm dừng</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(template.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(template)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                          title="Tải xuống"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePreview(template)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Xem trước"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị {templates.length} trên tổng số {totalCount} template
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Upload Template Mới</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  File Template <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept=".pptx,.ppt"
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                    className="w-full"
                    required
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Chỉ hỗ trợ file .pptx hoặc .ppt (Tối đa 50MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ảnh Thumbnail
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        thumbnailFile: e.target.files?.[0] || null,
                      }))
                    }
                    className="w-full"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Ảnh đại diện cho template (PNG, JPG, JPEG - Tối đa 5MB)
                  </p>
                  {uploadData.thumbnailFile && (
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      ✓ {uploadData.thumbnailFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên Template <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadData.templateName}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      templateName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Nhập tên template"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số Slide <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={uploadData.slideCount || ''}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      slideCount: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Nhập số lượng slide"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  placeholder="Mô tả ngắn gọn về template..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uploadData.isPremium}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        isPremium: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Template Premium
                  </span>
                </label>
              </div>

              {uploadData.isPremium && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={uploadData.price}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="0"
                    required={uploadData.isPremium}
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Template</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa Template</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTemplate(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateTemplate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên Template <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingTemplate.templateName}
                  onChange={(e) =>
                    setEditingTemplate((prev) => prev ? { ...prev, templateName: e.target.value } : null)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Nhập tên template"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số slide
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingTemplate.slideCount}
                  onChange={(e) =>
                    setEditingTemplate((prev) => prev ? { ...prev, slideCount: Number(e.target.value) } : null)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editingTemplate.description || ''}
                  onChange={(e) =>
                    setEditingTemplate((prev) => prev ? { ...prev, description: e.target.value } : null)
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  placeholder="Mô tả ngắn gọn về template..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTemplate.isPremium}
                    onChange={(e) =>
                      setEditingTemplate((prev) => prev ? { ...prev, isPremium: e.target.checked } : null)
                    }
                    className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Template Premium
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTemplate.isActive}
                    onChange={(e) =>
                      setEditingTemplate((prev) => prev ? { ...prev, isActive: e.target.checked } : null)
                    }
                    className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Kích hoạt
                  </span>
                </label>
              </div>

              {editingTemplate.isPremium && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingTemplate.price}
                    onChange={(e) =>
                      setEditingTemplate((prev) => prev ? { ...prev, price: Number(e.target.value) } : null)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="0"
                    required={editingTemplate.isPremium}
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
                  }}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  <span>Cập nhật Template</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900 truncate">
                  {previewTemplate.templateName}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {previewTemplate.slideCount} slides
                  {previewTemplate.isPremium && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Premium
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="ml-4 p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden bg-slate-100 relative">
              {loadingPreview ? (
                /* Loading state */
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-white rounded-xl p-8 shadow-lg max-w-md text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Đang tải preview...
                    </h3>
                    <p className="text-sm text-slate-600">
                      Vui lòng đợi trong giây lát
                    </p>
                  </div>
                </div>
              ) : previewUrl ? (
                /* Using Microsoft Office Online Viewer with Presigned URL */
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    previewUrl
                  )}`}
                  className="w-full h-full border-0"
                  title={`Preview: ${previewTemplate.templateName}`}
                />
              ) : (
                /* Fallback - no preview available */
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-white rounded-xl p-8 shadow-lg max-w-md text-center">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Preview không khả dụng
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Không thể tạo URL preview. Vui lòng tải file về để xem.
                    </p>
                    <button
                      onClick={() => {
                        setShowPreviewModal(false);
                        handleDownload(previewTemplate);
                      }}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải xuống</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {previewTemplate.description || 'Không có mô tả'}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleDownload(previewTemplate);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải xuống</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-medium transition-all duration-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      {showDeleteConfirm && deletingTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              Vô hiệu hóa Template
            </h3>
            
            <p className="text-slate-600 text-center mb-1">
              Bạn có chắc chắn muốn vô hiệu hóa template
            </p>
            <p className="text-slate-900 font-semibold text-center mb-4">
              "{deletingTemplate.templateName}"?
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Lưu ý:</span> Template sẽ được soft delete (IsActive = false). 
                Bạn có thể khôi phục lại bằng cách chỉnh sửa và bật lại trạng thái.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingTemplate(null);
                }}
                className="flex-1 px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Vô hiệu hóa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
