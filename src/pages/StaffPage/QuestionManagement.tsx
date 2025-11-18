import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/services/api/axios.config';
import { API_ENDPOINTS } from '@/utils/constants/api';

interface Option {
  optionId?: string;
  answer: string;
  isCorrect: boolean;
}

interface Question {
  questionId: string;
  topicId: string;
  topicName?: string;
  questionType: string;
  questionText: string;
  explanation?: string;
  level?: string;
  status: string;
  createdAt?: string;
  options: Option[];
}

interface Topic {
  id: string;
  name: string;
  gradeName: string;
}

export const QuestionManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form data
  const [formData, setFormData] = useState({
    topicId: '',
    questionText: '',
    explanation: '',
    level: 'NhanBiet',
    options: [
      { answer: '', isCorrect: false },
      { answer: '', isCorrect: false },
      { answer: '', isCorrect: false },
      { answer: '', isCorrect: false },
    ] as Option[],
  });

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.SLIDES.TOPICS);
        const data = response.data?.data ?? response.data;
        setTopics(data || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('Không thể tải danh sách chủ đề');
      }
    };
    fetchTopics();
  }, []);

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedTopic) params.topicId = selectedTopic;
      if (searchTerm) params.search = searchTerm;
      if (selectedLevel) params.level = selectedLevel;

      console.log('Fetching questions with params:', params);
      console.log('Endpoint:', API_ENDPOINTS.EXAM.QUESTIONS);
      
      const response = await axiosInstance.get(API_ENDPOINTS.EXAM.QUESTIONS, { params });
      console.log('Questions response:', response);
      const data = response.data?.data ?? response.data;
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(error.response?.data?.message || 'Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedTopic, searchTerm, selectedLevel]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQuestions();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.topicId || !formData.questionText.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.answer.trim());
    if (validOptions.length < 2) {
      toast.error('Câu hỏi phải có ít nhất 2 đáp án');
      return;
    }

    const correctCount = validOptions.filter(opt => opt.isCorrect).length;
    if (correctCount !== 1) {
      toast.error('Phải có đúng 1 đáp án đúng');
      return;
    }

    try {
      const createDto = {
        topicId: formData.topicId,
        questionType: 'MultipleChoice',
        questionText: formData.questionText,
        explanation: formData.explanation || undefined,
        level: formData.level,
        options: validOptions.map(opt => ({
          answer: opt.answer,
          isCorrect: opt.isCorrect,
        })),
      };

      console.log('Creating question with DTO:', JSON.stringify(createDto, null, 2));

      await axiosInstance.post(API_ENDPOINTS.EXAM.QUESTIONS, createDto);
      toast.success('Tạo câu hỏi thành công');
      setShowCreateModal(false);
      resetForm();
      fetchQuestions();
    } catch (error: any) {
      console.error('Error creating question:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      toast.error(error?.response?.data?.message || error?.response?.data?.title || 'Không thể tạo câu hỏi');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingQuestion) return;

    // Validation
    if (!formData.topicId || !formData.questionText.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.answer.trim());
    if (validOptions.length < 2) {
      toast.error('Câu hỏi phải có ít nhất 2 đáp án');
      return;
    }

    const correctCount = validOptions.filter(opt => opt.isCorrect).length;
    if (correctCount !== 1) {
      toast.error('Phải có đúng 1 đáp án đúng');
      return;
    }

    try {
      const updateDto = {
        topicId: formData.topicId,
        questionType: 'MultipleChoice',
        questionText: formData.questionText,
        explanation: formData.explanation || undefined,
        level: formData.level,
        status: '1',
        options: validOptions.map(opt => ({
          answer: opt.answer,
          isCorrect: opt.isCorrect,
        })),
      };

      await axiosInstance.put(
        API_ENDPOINTS.EXAM.QUESTION_BY_ID(editingQuestion.questionId),
        updateDto
      );
      toast.success('Cập nhật câu hỏi thành công');
      setShowEditModal(false);
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast.error(error?.response?.data?.message || 'Không thể cập nhật câu hỏi');
    }
  };

  const handleDelete = async () => {
    if (!deletingQuestion) return;

    try {
      await axiosInstance.delete(
        API_ENDPOINTS.EXAM.QUESTION_BY_ID(deletingQuestion.questionId)
      );
      toast.success('Xóa câu hỏi thành công');
      setShowDeleteConfirm(false);
      setDeletingQuestion(null);
      fetchQuestions();
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast.error(error?.response?.data?.message || 'Không thể xóa câu hỏi');
    }
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      topicId: question.topicId,
      questionText: question.questionText,
      explanation: question.explanation || '',
      level: question.level || 'NhanBiet',
      options: question.options.length > 0 
        ? question.options.map(opt => ({ ...opt }))
        : [
            { answer: '', isCorrect: false },
            { answer: '', isCorrect: false },
            { answer: '', isCorrect: false },
            { answer: '', isCorrect: false },
          ],
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      topicId: '',
      questionText: '',
      explanation: '',
      level: 'NhanBiet',
      options: [
        { answer: '', isCorrect: true },
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
      ],
    });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, { answer: '', isCorrect: false }],
      });
    }
  };

  const toggleCorrectAnswer = (index: number) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], answer: value };
    setFormData({ ...formData, options: newOptions });
  };

  // Pagination
  const filteredQuestions = questions;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  const getLevelText = (level?: string) => {
    const levels: Record<string, string> = {
      NhanBiet: 'Nhận biết',
      ThongHieu: 'Thông hiểu',
      VanDung: 'Vận dụng',
      VanDungCao: 'Vận dụng cao',
    };
    return levels[level || ''] || level || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Quản lý Câu hỏi
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý ngân hàng câu hỏi trắc nghiệm
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm câu hỏi</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chủ đề
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">Tất cả chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.gradeName} - {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mức độ
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">Tất cả mức độ</option>
              <option value="NhanBiet">Nhận biết</option>
              <option value="ThongHieu">Thông hiểu</option>
              <option value="VanDung">Vận dụng</option>
              <option value="VanDungCao">Vận dụng cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo nội dung câu hỏi..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">Đang tải...</p>
          </div>
        ) : paginatedQuestions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">Không có câu hỏi nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Câu hỏi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Chủ đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Mức độ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Đáp án
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paginatedQuestions.map((question) => (
                    <tr key={question.questionId} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm font-medium text-slate-900 line-clamp-2">
                            {question.questionText}
                          </p>
                          {question.explanation && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              Giải thích: {question.explanation}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {question.topicName || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {getLevelText(question.level)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {question.status === '1' || question.status === 'Active' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Vô hiệu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {question.options.slice(0, 2).map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs">
                              {opt.isCorrect ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-400" />
                              )}
                              <span className="text-slate-600 truncate max-w-[200px]">
                                {opt.answer}
                              </span>
                            </div>
                          ))}
                          {question.options.length > 2 && (
                            <p className="text-xs text-slate-400">
                              +{question.options.length - 2} đáp án khác
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingQuestion(question);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredQuestions.length)} trong số {filteredQuestions.length} câu hỏi
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-slate-600">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Thêm câu hỏi mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.gradeName} - {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  rows={3}
                  required
                  placeholder="Nhập nội dung câu hỏi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mức độ
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="NhanBiet">Nhận biết</option>
                  <option value="ThongHieu">Thông hiểu</option>
                  <option value="VanDung">Vận dụng</option>
                  <option value="VanDungCao">Vận dụng cao</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Giải thích
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  rows={2}
                  placeholder="Giải thích đáp án (tùy chọn)..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Đáp án <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    disabled={formData.options.length >= 6}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Thêm đáp án
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={option.isCorrect}
                        onChange={() => toggleCorrectAnswer(index)}
                        name="correctAnswer"
                        className="mt-2 w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
                        title="Đáp án đúng"
                      />
                      <input
                        type="text"
                        value={option.answer}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder={`Đáp án ${index + 1}...`}
                        required
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Chọn 1 đáp án đúng (mặc định là đáp án đầu tiên)
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                >
                  Tạo câu hỏi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Sửa câu hỏi</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingQuestion(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.gradeName} - {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mức độ
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="NhanBiet">Nhận biết</option>
                  <option value="ThongHieu">Thông hiểu</option>
                  <option value="VanDung">Vận dụng</option>
                  <option value="VanDungCao">Vận dụng cao</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Giải thích
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Đáp án <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    disabled={formData.options.length >= 6}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Thêm đáp án
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={option.isCorrect}
                        onChange={() => toggleCorrectAnswer(index)}
                        name="correctAnswerEdit"
                        className="mt-2 w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
                        title="Đáp án đúng"
                      />
                      <input
                        type="text"
                        value={option.answer}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder={`Đáp án ${index + 1}...`}
                        required
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Chọn 1 đáp án đúng
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Xác nhận xóa</h2>
            <p className="text-slate-600 mb-6">
              Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingQuestion(null);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
