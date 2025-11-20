import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { templateService } from '@/services/template/templateService';
import toast from 'react-hot-toast';
import { X, FileText, Download, Star, Lock } from 'lucide-react';

export interface UserTemplateResponse {
  templateId: string;
  objectKey: string;
  templateName: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  contentStructure?: string;
  slideCount: number;
  isPremium: boolean;
  price: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: number;
}

interface TemplateSelectorProps {
  templates: UserTemplateResponse[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  loading?: boolean;
  actionButtons?: (template: UserTemplateResponse) => React.ReactNode;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  loading = false,
  actionButtons,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<UserTemplateResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Filter templates based on search term
  const filteredTemplates = useMemo(() => {
    if (!searchTerm.trim()) return templates;
    
    const search = searchTerm.toLowerCase();
    return templates.filter(template => 
      template.templateName.toLowerCase().includes(search) ||
      template.description?.toLowerCase().includes(search)
    );
  }, [templates, searchTerm]);

  const handlePreview = async (template: UserTemplateResponse, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent template selection
    
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

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        <p className="mt-3 text-gray-600 font-medium">Đang tải templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        <p className="text-gray-600 font-medium mb-2">Bạn chưa có template nào</p>
        <p className="text-sm text-gray-500">Vui lòng mua hoặc đăng ký template để sử dụng</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          placeholder="🔍 Tìm kiếm template theo tên hoặc mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Tìm thấy <span className="font-bold text-primary-600">{filteredTemplates.length}</span> template
          </p>
          {filteredTemplates.length === 0 && (
            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">Không tìm thấy template phù hợp</p>
          <p className="text-sm text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <React.Fragment key={template.templateId}>
              <div
                onClick={() => onSelectTemplate(template.templateId)}
                className={`group cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  selectedTemplateId === template.templateId
                    ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-xl scale-105'
                    : 'border-gray-200 bg-white hover:border-primary-400 hover:shadow-lg hover:scale-102'
                }`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.templateName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${template.thumbnailUrl ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200`}>
                  <svg className="w-20 h-20 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>

                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </div>
                )}

                {/* Selected Checkmark Overlay */}
                {selectedTemplateId === template.templateId && (
                  <div className="absolute inset-0 bg-primary-600 bg-opacity-20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center animate-bounce shadow-2xl">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className={`text-base font-bold leading-snug flex-1 ${
                    selectedTemplateId === template.templateId 
                      ? 'text-primary-700' 
                      : 'text-gray-900 group-hover:text-primary-600'
                  }`}>
                    {template.templateName}
                  </h3>
                  {selectedTemplateId === template.templateId && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {template.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                )}

                {/* Template Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">{template.slideCount} slides</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{template.downloadCount} lượt dùng</span>
                  </div>
                </div>

                {/* Preview Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-semibold"
                  onClick={(e) => handlePreview(template, e)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem trước
                  </span>
                </Button>
              </div>
            </div>

            {/* Action Buttons - Render immediately after selected template */}
            {selectedTemplateId === template.templateId && actionButtons && (
              <div className="md:col-span-2 lg:col-span-3">
                {actionButtons(template)}
              </div>
            )}
          </React.Fragment>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowPreviewModal(false);
            setPreviewTemplate(null);
            setPreviewUrl('');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Không thể tải preview
                    </h3>
                    <p className="text-sm text-gray-600">
                      Vui lòng thử lại sau
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
