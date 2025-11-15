import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Clock,
  RefreshCw,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminSlideService, type SlideDetailDto, type GetSlidesParams } from '@/services/api/adminSlideService';

export const AdminSlideManagement: React.FC = () => {
  const [slides, setSlides] = useState<SlideDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<GetSlidesParams>({
    pageNumber: 1,
    pageSize: 10,
    generationStatus: undefined,
    gradeId: undefined,
    topicId: undefined,
    sortBy: 'GeneratedAt',
    sortOrder: 'desc',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter options
  const [grades, setGrades] = useState<Array<{ id: string; name: string }>>([]);
  const [topics, setTopics] = useState<Array<{ id: string; name: string; gradeId: string }>>([]);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    jsonCreated: 0,
    fileCreated: 0,
    failed: 0,
    pending: 0,
  });

  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<SlideDetailDto | null>(null);

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [gradesData, topicsData] = await Promise.all([
        adminSlideService.getGrades(),
        adminSlideService.getTopics(),
      ]);
      
      setGrades(gradesData);
      setTopics(topicsData);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadSlides = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminSlideService.getSlides(filters);
      
      setSlides(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setCurrentPage(result.pageNumber);
      
      // Load statistics
      const statsData = await adminSlideService.getStatistics();
      setStats(statsData);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Không thể tải danh sách slides');
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load slides when filters change
  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast('Tìm kiếm theo tên đang được phát triển. Vui lòng sử dụng bộ lọc.');
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  };

  const handleFilterChange = (key: keyof GetSlidesParams, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      pageNumber: 1,
    }));
    
    if (key === 'gradeId') {
      setFilters(prev => ({ ...prev, topicId: undefined }));
    }
  };

  const handleDownload = async (slide: SlideDetailDto) => {
    if (!slide.filePath || slide.generationStatus?.trim() !== 'Hoàn thành') {
      toast.error('Slide chưa được tạo hoặc đang xử lý');
      return;
    }
    
    try {
      const loadingToast = toast.loading('Đang tải xuống...');
      const blob = await adminSlideService.downloadSlide(slide.generatedSlideId);
      
      const url = globalThis.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slide.syllabusLesson}-${slide.gradeName}.pptx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(url);
      
      toast.success('Tải xuống thành công!', { id: loadingToast });
    } catch (error) {
      toast.error('Không thể tải xuống slide');
      console.error('Download error:', error);
    }
  };

  const handlePreview = (slide: SlideDetailDto) => {
    setPreviewSlide(slide);
    setShowPreviewModal(true);
  };

  const handleRefresh = () => {
    loadSlides();
    toast.success('Đã làm mới dữ liệu');
  };

  const getStatusBadge = (status?: string) => {
    const statusValue = status?.trim() || '';
    const statusConfig: Record<string, { label: string; class: string }> = {
      'Đã tạo dữ liệu': { label: 'Đã tạo dữ liệu', class: 'bg-blue-100 text-blue-700 border-blue-200' },
      'Đã tạo tệp': { label: 'Đã tạo tệp', class: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      'Hoàn thành': { label: 'Hoàn thành', class: 'bg-green-100 text-green-700 border-green-200' },
      'Thất bại': { label: 'Thất bại', class: 'bg-red-100 text-red-700 border-red-200' },
      'Chờ xử lý': { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    };

    const config = statusConfig[statusValue] || { label: statusValue || 'Không xác định', class: 'bg-slate-100 text-slate-700 border-slate-200' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const filteredTopics = filters.gradeId
    ? topics.filter(t => t.gradeId === filters.gradeId)
    : topics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Quản lý Slides
          </h1>
          <p className="text-slate-600 mt-1">
            Theo dõi và quản lý tất cả slide được generate trong hệ thống
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Tổng slides</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
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
              <p className="text-sm text-slate-600 font-medium">Hoàn thành</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-700" />
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
              <p className="text-sm text-slate-600 font-medium">Đã tạo dữ liệu</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{stats.jsonCreated}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-700" />
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
              <p className="text-sm text-slate-600 font-medium">Đã tạo tệp</p>
              <p className="text-3xl font-bold text-indigo-700 mt-2">{stats.fileCreated}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Thất bại</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{stats.failed}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo bài học (đang phát triển)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
            </div>
            
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.generationStatus || 'all'}
              onChange={(e) => handleFilterChange('generationStatus', e.target.value === 'all' ? undefined : e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã tạo tệp">Đã tạo tệp</option>
              <option value="Đã tạo dữ liệu">Đã tạo dữ liệu</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Thất bại">Thất bại</option>
            </select>

            <select
              value={filters.gradeId || 'all'}
              onChange={(e) => handleFilterChange('gradeId', e.target.value === 'all' ? undefined : e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white"
            >
              <option value="all">Tất cả lớp</option>
              {grades.map(grade => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>

            <select
              value={filters.topicId || 'all'}
              onChange={(e) => handleFilterChange('topicId', e.target.value === 'all' ? undefined : e.target.value)}
              disabled={!filters.gradeId}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="all">Tất cả chủ đề</option>
              {filteredTopics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
              }}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white"
            >
              <option value="GeneratedAt-desc">Mới nhất</option>
              <option value="GeneratedAt-asc">Cũ nhất</option>
              <option value="GradeName-asc">Lớp A-Z</option>
              <option value="GradeName-desc">Lớp Z-A</option>
              <option value="TopicSortOrder-asc">Chủ đề tăng dần</option>
              <option value="LessonOrder-asc">Bài học tăng dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Slides Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Bài học
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Lớp/Chủ đề
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Số slides
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Kích thước
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Thời gian
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
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-red-600 rounded-full animate-spin" />
                      <span className="text-slate-600">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && slides.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-600">
                    Không có slide nào
                  </td>
                </tr>
              )}
              {!loading && slides.length > 0 && slides.map((slide, index) => (
                  <motion.tr
                    key={slide.generatedSlideId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {slide.syllabusLesson}
                          </p>
                          {slide.aiPrompt && (
                            <p className="text-sm text-slate-500 truncate">
                              {slide.aiPrompt}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{slide.gradeName}</p>
                        <p className="text-sm text-slate-500">{slide.topicName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {slide.slideCount || slide.numberOfSlides || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {formatFileSize(slide.fileSize)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(slide.generationStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {slide.processingTime ? `${slide.processingTime.toFixed(1)}s` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(slide.generatedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {slide.generationStatus?.trim() === 'Hoàn thành' && (
                          <>
                            <button
                              onClick={() => handleDownload(slide)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="Tải xuống"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePreview(slide)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị {slides.length} trên tổng số {totalCount} slides
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
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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

      {/* Preview Modal */}
      {showPreviewModal && previewSlide && (
        <button 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-0 cursor-default"
          onClick={() => setShowPreviewModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowPreviewModal(false)}
          aria-label="Đóng modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900 truncate">
                  Chi tiết Slide
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {previewSlide.syllabusLesson}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="ml-4 p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Lớp</p>
                  <p className="text-slate-900">{previewSlide.gradeName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Chủ đề</p>
                  <p className="text-slate-900">{previewSlide.topicName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Số slides</p>
                  <p className="text-slate-900">{previewSlide.slideCount || previewSlide.numberOfSlides}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Kích thước file</p>
                  <p className="text-slate-900">{formatFileSize(previewSlide.fileSize)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Trạng thái</p>
                  <div>{getStatusBadge(previewSlide.generationStatus)}</div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-1">Thời gian xử lý</p>
                  <p className="text-slate-900">
                    {previewSlide.processingTime ? `${previewSlide.processingTime.toFixed(2)}s` : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-600 font-medium mb-1">Ngày tạo</p>
                  <p className="text-slate-900">{formatDate(previewSlide.generatedAt)}</p>
                </div>
                {previewSlide.aiPrompt && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600 font-medium mb-1">Prompt AI</p>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                      {previewSlide.aiPrompt}
                    </p>
                  </div>
                )}
                {previewSlide.learningObjectives && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600 font-medium mb-1">Mục tiêu học tập</p>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                      {previewSlide.learningObjectives}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-end space-x-2">
              {previewSlide.generationStatus?.trim() === 'Hoàn thành' && (
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleDownload(previewSlide);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải xuống</span>
                </button>
              )}
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-medium transition-all duration-200"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </button>
      )}
    </div>
  );
};
