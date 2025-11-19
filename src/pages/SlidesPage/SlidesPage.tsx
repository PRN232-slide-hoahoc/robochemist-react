import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TemplateSelector, UserTemplateResponse } from '@/components/features/TemplateSelector';
import { templateService } from '@/services/template/templateService';
import slideService, {
  Grade,
  Topic,
  Syllabus,
  GenerateSlideResponse,
  SlideDetailDto,
} from '@/services/api/slideService';

export const SlidesPage: React.FC = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  // Data lists
  const [grades, setGrades] = useState<Grade[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplateResponse[]>([]);

  // Selected values
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Form inputs
  const [numberOfSlides, setNumberOfSlides] = useState<number>(10);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingSyllabuses, setLoadingSyllabuses] = useState(false);
  const [loadingUserTemplates, setLoadingUserTemplates] = useState(false);
  const [result, setResult] = useState<GenerateSlideResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<SlideDetailDto[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter state
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [filterTopic, setFilterTopic] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('GeneratedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Change template state
  const [changingSlideId, setChangingSlideId] = useState<string | null>(null);
  const [changeTemplates, setChangeTemplates] = useState<UserTemplateResponse[]>([]);
  const [changeSelectedTemplate, setChangeSelectedTemplate] = useState<string>('');
  const [loadingChangeTemplates, setLoadingChangeTemplates] = useState(false);
  const [changingTemplate, setChangingTemplate] = useState(false);

  // Load grades on mount
  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      try {
        const data = await slideService.getGrades();
        setGrades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load grades:', err);
        setGrades([]);
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchGrades();
  }, []);

  // Load topics for filter dropdown based on selected grade
  useEffect(() => {
    const fetchTopicsForFilter = async () => {
      setLoadingTopics(true);
      try {
        const data = filterGrade 
          ? await slideService.getTopicsByGrade(filterGrade)
          : await slideService.getTopics();
        setTopics(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load topics for filter:', err);
        setTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };

    if (activeTab === 'history') {
      fetchTopicsForFilter();
    }
  }, [activeTab, filterGrade]);

  // Load history when filters/pagination change
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, pageSize, filterGrade, filterTopic, filterStatus, sortBy, sortOrder]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await slideService.getSlideHistory(
        currentPage,
        pageSize,
        filterGrade || undefined,
        filterTopic || undefined,
        filterStatus || undefined,
        sortBy,
        sortOrder
      );
      setHistory(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setFilterGrade('');
    setFilterTopic('');
    setFilterStatus('');
    setSortBy('GeneratedAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Load topics when grade changes
  useEffect(() => {
    if (!selectedGrade) {
      setTopics([]);
      setSelectedTopic('');
      setSyllabuses([]);
      setSelectedSyllabus('');
      return;
    }

    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const data = await slideService.getTopicsByGrade(selectedGrade);
        setTopics(Array.isArray(data) ? data : []);
        // Reset topic and syllabus selection
        setSelectedTopic('');
        setSyllabuses([]);
        setSelectedSyllabus('');
      } catch (err) {
        console.error('Failed to load topics:', err);
        setTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [selectedGrade]);

  // Load syllabuses when topic changes
  useEffect(() => {
    if (!selectedTopic) {
      setSyllabuses([]);
      setSelectedSyllabus('');
      return;
    }

    const fetchSyllabuses = async () => {
      setLoadingSyllabuses(true);
      try {
        const data = await slideService.getSyllabuses(selectedGrade, selectedTopic);
        setSyllabuses(Array.isArray(data) ? data : []);
        // Reset syllabus selection
        setSelectedSyllabus('');
      } catch (err) {
        console.error('Failed to load syllabuses:', err);
        setSyllabuses([]);
      } finally {
        setLoadingSyllabuses(false);
      }
    };

    fetchSyllabuses();
  }, [selectedTopic, selectedGrade]);

  // Load user templates when syllabus is selected
  useEffect(() => {
    if (!selectedSyllabus) {
      setUserTemplates([]);
      setSelectedTemplate('');
      return;
    }

    const fetchUserTemplates = async () => {
      setLoadingUserTemplates(true);
      try {
        const data = await templateService.getMyTemplates();
        setUserTemplates(Array.isArray(data) ? data : []);
        // Reset template selection
        setSelectedTemplate('');
      } catch (err) {
        console.error('Failed to load user templates:', err);
        setUserTemplates([]);
      } finally {
        setLoadingUserTemplates(false);
      }
    };

    fetchUserTemplates();
  }, [selectedSyllabus]);

  const handleGenerate = async () => {
    if (!selectedSyllabus) {
      setError('Vui lòng chọn đầy đủ: Khối → Chủ đề → Bài học');
      return;
    }

    if (!selectedTemplate) {
      setError('Vui lòng chọn template để tạo slide');
      return;
    }

    if (numberOfSlides < 3 || numberOfSlides > 30) {
      setError('Số lượng slide phải từ 3 đến 30');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);
    
    try {
      const requestPayload: any = {
        syllabusId: selectedSyllabus,
        numberOfSlides: numberOfSlides,
        templateId: selectedTemplate,
      };

      // Only add aiPrompt if it has meaningful content
      if (aiPrompt && aiPrompt.trim().length > 0) {
        requestPayload.aiPrompt = aiPrompt.trim();
      }

      const response = await slideService.generateSlide(requestPayload);

      setResult(response);
    } catch (err: any) {
      // Handle validation errors from backend
      if (err?.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        setError(errorMessages.join('. '));
      } else {
        const errorMessage = err?.response?.data?.message 
          || err?.response?.data?.title
          || err.message 
          || 'Tạo slide thất bại';
        setError(errorMessage);
      }
      console.error('Generate slide error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Handle start change template
  const handleStartChangeTemplate = async (slideId: string) => {
    setChangingSlideId(slideId);
    setChangeSelectedTemplate('');
    setLoadingChangeTemplates(true);
    try {
      const data = await templateService.getMyTemplates();
      setChangeTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setChangeTemplates([]);
    } finally {
      setLoadingChangeTemplates(false);
    }
  };

  // Handle cancel change template
  const handleCancelChangeTemplate = () => {
    setChangingSlideId(null);
    setChangeSelectedTemplate('');
    setChangeTemplates([]);
  };

  // Handle confirm change template
  const handleConfirmChangeTemplate = async () => {
    if (!changeSelectedTemplate) {
      toast.error('Vui lòng chọn template mới');
      return;
    }

    if (!changingSlideId) {
      toast.error('Không tìm thấy slide cần đổi template');
      return;
    }

    setChangingTemplate(true);
    try {
      // Call API to change template
      await slideService.changeSlideTemplate(changingSlideId, changeSelectedTemplate);
      toast.success('Đổi template thành công! Slide sẽ được tạo lại.', {
        duration: 4000,
        icon: '✅',
      });
      handleCancelChangeTemplate();
      // Reload history
      loadHistory();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message 
        || err?.response?.data?.title
        || err.message 
        || 'Đổi template thất bại';
      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      });
      console.error('Change template error:', err?.response?.data || err);
    } finally {
      setChangingTemplate(false);
    }
  };

  return (
    <Layout>
      <Container className="py-10">
        {/* Header with gradient */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Tạo Slide Hóa Học
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn khối lớp, chủ đề, bài học và để AI tạo slide chuyên nghiệp cho bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-semibold text-base transition-all duration-300 border-b-2 -mb-0.5 ${
                activeTab === 'create'
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo Slide Mới
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-semibold text-base transition-all duration-300 border-b-2 -mb-0.5 ${
                activeTab === 'history'
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lịch Sử
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' ? (
          <>
            {/* Step 1: Select Grade */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold text-base shadow-lg">
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chọn khối lớp</h2>
              <p className="text-sm text-gray-500">Chọn khối lớp học phù hợp</p>
            </div>
          </div>

          {loadingGrades ? (
            <div className="text-center py-16">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-3 text-gray-600 font-medium">Đang tải khối lớp...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {grades.map((grade) => (
                <div
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
                    selectedGrade === grade.id
                      ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-xl scale-105'
                      : 'border-gray-200 bg-white hover:border-primary-400 hover:shadow-lg hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl font-bold ${selectedGrade === grade.id ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-600'}`}>
                        {grade.name}
                      </h3>
                      {grade.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{grade.description}</p>
                      )}
                    </div>
                    {selectedGrade === grade.id && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center animate-bounce">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Select Topic */}
        {selectedGrade && (
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold text-base shadow-lg">
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chọn chủ đề</h2>
                <p className="text-sm text-gray-500">Chọn chương học bạn muốn tạo slide</p>
              </div>
            </div>

            {loadingTopics ? (
              <div className="text-center py-16">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                <p className="mt-3 text-gray-600 font-medium">Đang tải chủ đề...</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 font-medium">Không có chủ đề nào cho khối lớp này</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`group cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ${
                      selectedTopic === topic.id
                        ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-102'
                        : 'border-gray-200 bg-white hover:border-primary-400 hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`text-base font-semibold ${selectedTopic === topic.id ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-600'}`}>
                          {topic.sortOrder && (
                            <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mr-2 ${
                              selectedTopic === topic.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 group-hover:from-primary-100 group-hover:to-primary-200 group-hover:text-primary-700'
                            }`}>
                              Chương {topic.sortOrder}
                            </span>
                          )}
                          {topic.name}
                        </h3>
                      </div>
                      {selectedTopic === topic.id && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Syllabus */}
        {selectedTopic && (
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold text-base shadow-lg">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chọn bài học</h2>
                <p className="text-sm text-gray-500">Chọn bài học cụ thể để tạo slide</p>
              </div>
            </div>

            {loadingSyllabuses ? (
              <div className="text-center py-16">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                <p className="mt-3 text-gray-600 font-medium">Đang tải bài học...</p>
              </div>
            ) : syllabuses.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-600 font-medium">Không có bài học nào cho chủ đề này</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {syllabuses.map((syllabus, index) => (
                  <div
                    key={syllabus.id}
                    onClick={() => setSelectedSyllabus(syllabus.id)}
                    className={`group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
                      selectedSyllabus === syllabus.id
                        ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-xl scale-105'
                        : 'border-gray-200 bg-white hover:border-primary-400 hover:shadow-lg hover:scale-102'
                    }`}
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3">
                          <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${
                            selectedSyllabus === syllabus.id 
                              ? 'bg-primary-600 text-white shadow-md' 
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 group-hover:from-primary-100 group-hover:to-primary-200 group-hover:text-primary-700'
                          }`}>
                            Bài {syllabus.lessonOrder || index + 1}
                          </span>
                        </div>
                        <h3 className={`text-base font-semibold leading-snug ${
                          selectedSyllabus === syllabus.id 
                            ? 'text-primary-700' 
                            : 'text-gray-900 group-hover:text-primary-600'
                        }`}>
                          {syllabus.lesson}
                        </h3>
                      </div>
                      {selectedSyllabus === syllabus.id && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center animate-bounce">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Select Template */}
        {selectedSyllabus && (
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold text-base shadow-lg">
                4
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chọn template</h2>
                <p className="text-sm text-gray-500">Chọn template PowerPoint bạn muốn sử dụng</p>
              </div>
            </div>

            <TemplateSelector
              templates={userTemplates}
              selectedTemplateId={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              loading={loadingUserTemplates}
            />
          </div>
        )}

        {/* Step 5: Configuration */}
        {selectedTemplate && (
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold text-base shadow-lg">
                5
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cấu hình slide</h2>
                <p className="text-sm text-gray-500">Tùy chỉnh nội dung slide</p>
              </div>
            </div>

            <Card className="border-2 border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Number of Slides */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Số lượng slide
                      </span>
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      value={numberOfSlides}
                      onChange={(e) => setNumberOfSlides(Number(e.target.value))}
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg font-semibold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Yêu cầu: 3-30 slides
                    </p>
                  </div>

                  {/* AI Prompt */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Yêu cầu bổ sung cho AI
                      </span>
                    </label>
                    <textarea
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                      rows={4}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ví dụ: Hãy tạo slide với nội dung chi tiết và ví dụ minh họa cụ thể."
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      AI sẽ tự động tạo nội dung nếu bạn để trống
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="flex-1 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <span className="flex flex-col items-center justify-center gap-2">
                          <span className="flex items-center gap-3">
                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Đang tạo slide với AI...
                          </span>
                          <span className="text-sm opacity-75">Vui lòng đợi 1-3 phút</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Tạo Slide
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')} className="px-8 py-4 text-base font-semibold border-2">
                      Hủy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 border-2 border-red-300 p-6 shadow-lg animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-red-800 mb-1">Có lỗi xảy ra</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-8 shadow-xl animate-fadeIn">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-green-800 mb-2">Tạo slide thành công!</h4>
                <p className="text-base text-green-700">Slide của bạn đã được tạo và sẵn sàng để tải xuống</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-4 shadow-inner">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Trạng thái</p>
                    <p className="text-sm font-bold text-gray-900">{result.generationStatus ?? 'Hoàn thành'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Số slide</p>
                    <p className="text-sm font-bold text-gray-900">{result.slideCount ?? numberOfSlides}</p>
                  </div>
                </div>
              </div>
            </div>
              
            {result.filePath && (
              <div className="mb-4">
                <button
                  onClick={async () => {
                    try {
                      const blob = await slideService.downloadFileByPath(result.filePath!);
                      const url = globalThis.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `slide-${result.generatedSlideId || 'generated'}.pptx`;
                      document.body.appendChild(a);
                      a.click();
                      globalThis.URL.revokeObjectURL(url);
                      a.remove();
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Không thể tải file. Vui lòng thử lại!', {
                        icon: '📥',
                        duration: 4000,
                      });
                    }
                  }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải file slide (.pptx)
                </button>
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          /* History Tab */
          <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Bộ lọc & Sắp xếp
                  </h3>
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Đặt lại
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Filter by Grade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khối lớp
                    </label>
                    <select
                      value={filterGrade}
                      onChange={(e) => {
                        setFilterGrade(e.target.value);
                        setFilterTopic(''); // Reset topic when grade changes
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Tất cả</option>
                      {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Topic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chủ đề
                    </label>
                    <select
                      value={filterTopic}
                      onChange={(e) => {
                        setFilterTopic(e.target.value);
                        setCurrentPage(1);
                      }}
                      disabled={loadingTopics}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{loadingTopics ? 'Đang tải...' : 'Tất cả'}</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.sortOrder ? `Chương ${topic.sortOrder}: ` : ''}{topic.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã tạo tệp">Đã tạo tệp</option>
                      <option value="Đã tạo dữ liệu">Đã tạo dữ liệu</option>
                      <option value="Processing">Đang xử lý</option>
                      <option value="Failed">Thất bại</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sắp xếp theo
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="GeneratedAt">Ngày tạo</option>
                      <option value="GradeName">Khối lớp</option>
                      <option value="TopicSortOrder">Chủ đề</option>
                      <option value="LessonOrder">Bài học</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="desc">Giảm dần</option>
                      <option value="asc">Tăng dần</option>
                    </select>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Tìm thấy <span className="font-bold text-primary-600">{totalCount}</span> kết quả
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* History List */}
            {loadingHistory ? (
              <div className="text-center py-16">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                <p className="mt-3 text-gray-600 font-medium">Đang tải lịch sử...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 font-medium mb-2">Chưa có lịch sử tạo slide</p>
                <p className="text-sm text-gray-500">Bắt đầu tạo slide đầu tiên của bạn!</p>
                <Button
                  onClick={() => setActiveTab('create')}
                  className="mt-4"
                >
                  Tạo slide ngay
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <React.Fragment key={item.generatedSlideId || index}>
                    <div
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-400 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Content */}
                        <div className="flex-1 space-y-4">
                          {/* Header with badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 text-xs font-bold rounded-lg border border-primary-200">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              {item.gradeName || 'N/A'}
                            </span>
                            {item.generationStatus && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg ${
                                item.generationStatus === 'Hoàn thành' || item.generationStatus === 'Success' || item.generationStatus === 'Completed'
                                  ? 'bg-green-100 text-green-700 border border-green-200'
                                  : item.generationStatus === 'Đã tạo tệp'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : item.generationStatus === 'Đã tạo dữ liệu'
                                  ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                                  : item.generationStatus === 'Processing'
                                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                  : item.generationStatus === 'Failed'
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                {item.generationStatus === 'Hoàn thành' ? '✓ Hoàn thành' :
                                 item.generationStatus === 'Đã tạo tệp' ? '📄 Đã tạo tệp' :
                                 item.generationStatus === 'Đã tạo dữ liệu' ? '📊 Đã tạo dữ liệu' :
                                 item.generationStatus === 'Processing' ? '⏳ Đang xử lý' :
                                 item.generationStatus === 'Failed' ? '✗ Thất bại' :
                                 item.generationStatus}
                              </span>
                            )}
                          </div>

                          {/* Title and Topic */}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                              {item.syllabusLesson || 'Chưa có tiêu đề'}
                            </h3>
                            {item.topicName && (
                              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {item.topicName}
                              </p>
                            )}
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Số slide</p>
                                <p className="text-sm font-bold text-gray-900">{item.slideCount || 0}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Ngày tạo</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {item.generatedAt ? new Date(item.generatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                                </p>
                              </div>
                            </div>

                            {item.fileSize && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Kích thước</p>
                                  <p className="text-sm font-bold text-gray-900">
                                    {(item.fileSize / 1024 / 1024).toFixed(1)} MB
                                  </p>
                                </div>
                              </div>
                            )}

                            {item.processingTime && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Thời gian</p>
                                  <p className="text-sm font-bold text-gray-900">{item.processingTime}s</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Learning Objectives Preview */}
                          {item.learningObjectives && (
                            <div className="pt-2">
                              <p className="text-xs text-gray-500 mb-1">Mục tiêu bài học:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{item.learningObjectives}</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex lg:flex-col gap-2 lg:w-36">
                          {item.filePath && (
                            <button
                              onClick={async () => {
                                try {
                                  const blob = await slideService.downloadFileByPath(item.filePath!);
                                  const url = globalThis.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `slide-${item.generatedSlideId}.pptx`;
                                  document.body.appendChild(a);
                                  a.click();
                                  globalThis.URL.revokeObjectURL(url);
                                  a.remove();
                                } catch (error) {
                                  console.error('Download failed:', error);
                                  toast.error('Không thể tải file. Vui lòng thử lại!', {
                                    icon: '📥',
                                    duration: 4000,
                                  });
                                }
                              }}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Tải xuống
                            </button>
                          )}
                          
                          {item.processingTime !== 0 && (
                            <button
                              onClick={() => handleStartChangeTemplate(item.generatedSlideId)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              Đổi template
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Change Template Section - Show inline under this slide */}
                    {changingSlideId === item.generatedSlideId && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">Đổi template cho slide</h3>
                              <p className="text-sm text-gray-600">Chọn template mới - slide sẽ được tạo lại</p>
                            </div>
                          </div>
                          <button
                            onClick={handleCancelChangeTemplate}
                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-all"
                          >
                            Hủy
                          </button>
                        </div>

                        <TemplateSelector
                          templates={changeTemplates}
                          selectedTemplateId={changeSelectedTemplate}
                          onSelectTemplate={setChangeSelectedTemplate}
                          loading={loadingChangeTemplates}
                          actionButtons={(template) => (
                            <Card className="border-2 border-blue-200 shadow-lg animate-fadeIn">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Template đã chọn</p>
                                    <p className="text-lg font-bold text-blue-700">
                                      {template.templateName}
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Button
                                      variant="outline"
                                      onClick={handleCancelChangeTemplate}
                                      disabled={changingTemplate}
                                      className="px-6 py-3 font-semibold"
                                    >
                                      Hủy
                                    </Button>
                                    <Button
                                      onClick={handleConfirmChangeTemplate}
                                      disabled={changingTemplate}
                                      className="px-6 py-3 font-semibold"
                                    >
                                      {changingTemplate ? (
                                        <span className="flex items-center gap-2">
                                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                          </svg>
                                          Đang đổi template...
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-2">
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Xác nhận đổi template
                                        </span>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loadingHistory && history.length > 0 && (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Hiển thị</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-600">kết quả/trang</span>
                    </div>

                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Trang <span className="font-bold text-gray-900">{currentPage}</span> / <span className="font-bold text-gray-900">{totalPages || 1}</span>
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                      {/* First Page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        title="Trang đầu"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Previous Page */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        title="Trang trước"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                              currentPage === pageNum
                                ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Page */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        title="Trang sau"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        title="Trang cuối"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default SlidesPage;
