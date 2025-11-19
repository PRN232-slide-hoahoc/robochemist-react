import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { slideService } from '@/services/api/slideService';
import type { Syllabus, Grade, Topic, CreateSyllabusRequest } from '@/types/slide.types';

export const SyllabusManagement: React.FC = () => {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSyllabusRequest>({
    topicId: '',
    lessonOrder: 1,
    lesson: '',
    learningObjectives: '',
    contentOutline: '',
    keyConcepts: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSyllabuses();
  }, [selectedGrade, selectedTopic]);

  useEffect(() => {
    if (selectedGrade) {
      const filtered = topics.filter(t => t.gradeId === selectedGrade);
      setFilteredTopics(filtered);
      // Reset selected topic if it's not in the filtered list
      if (selectedTopic && !filtered.find(t => t.id === selectedTopic)) {
        setSelectedTopic('');
      }
    } else {
      setFilteredTopics(topics);
    }
  }, [selectedGrade, topics]);

  const loadData = async () => {
    try {
      const [gradesData, topicsData] = await Promise.all([
        slideService.getGrades(),
        slideService.getTopics(),
      ]);
      setGrades(gradesData);
      setTopics(topicsData);
      setFilteredTopics(topicsData);
      await loadSyllabuses();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSyllabuses = async () => {
    try {
      console.log('Loading syllabuses with filters:', { selectedGrade, selectedTopic });
      const data = await slideService.getSyllabuses(selectedGrade, selectedTopic);
      console.log('Loaded syllabuses:', data);
      setSyllabuses(data);
    } catch (error) {
      console.error('Failed to load syllabuses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await slideService.updateSyllabus(editingId, formData);
      } else {
        await slideService.createSyllabus(formData);
      }
      await loadSyllabuses();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save syllabus:', error);
      alert('Lỗi khi lưu nội dung bài học');
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const syllabus = await slideService.getSyllabusById(id);
      setFormData({
        topicId: syllabus.topicId,
        lessonOrder: syllabus.lessonOrder || 1,
        lesson: syllabus.lesson,
        learningObjectives: syllabus.learningObjectives || '',
        contentOutline: syllabus.contentOutline || '',
        keyConcepts: syllabus.keyConcepts || '',
      });
      setEditingId(id);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to load syllabus:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await slideService.toggleSyllabusStatus(id);
      await loadSyllabuses();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      topicId: '',
      lessonOrder: 1,
      lesson: '',
      learningObjectives: '',
      contentOutline: '',
      keyConcepts: '',
    });
  };

  const filteredSyllabuses = syllabuses.filter(s =>
    s.lesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.topicName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTopicName = (topicId: string) => {
    return topics.find(t => t.id === topicId)?.name || 'N/A';
  };

  const getGradeName = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return 'N/A';
    return grades.find(g => g.id === topic.gradeId)?.name || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-7 h-7" />
            <span>Quản lý nội dung bài học</span>
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý giáo trình và nội dung bài học
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm bài học</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 text-slate-700 font-medium">
          <Filter className="w-5 h-5" />
          <span>Bộ lọc</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả khối</option>
            {grades.map(grade => (
              <option key={grade.id} value={grade.id}>{grade.name}</option>
            ))}
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả chủ đề</option>
            {filteredTopics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Syllabuses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thứ tự
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Bài học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Khối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSyllabuses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredSyllabuses.map((syllabus) => (
                  <tr key={syllabus.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {syllabus.lessonOrder || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <div className="font-medium">{syllabus.lesson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {syllabus.topicName || getTopicName(syllabus.topicId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {getGradeName(syllabus.topicId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        syllabus.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {syllabus.isActive ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(syllabus.id)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(syllabus.id)}
                        className="text-slate-600 hover:text-slate-900 inline-flex items-center space-x-1"
                      >
                        {syllabus.isActive ? (
                          <><EyeOff className="w-4 h-4" /><span>Ẩn</span></>
                        ) : (
                          <><Eye className="w-4 h-4" /><span>Hiện</span></>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75 z-[9998]"
                onClick={handleCloseModal}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-[9999] relative"
              >
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        {editingId ? 'Sửa bài học' : 'Thêm bài học mới'}
                      </h3>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="text-slate-400 hover:text-slate-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Chủ đề <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={formData.topicId}
                            onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Chọn chủ đề</option>
                            {topics.map(topic => (
                              <option key={topic.id} value={topic.id}>
                                {topic.name} ({grades.find(g => g.id === topic.gradeId)?.name})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Thứ tự bài <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={formData.lessonOrder}
                            onChange={(e) => setFormData({ ...formData, lessonOrder: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Tên bài học <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lesson}
                          onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="VD: Nguyên tử - Cấu tạo nguyên tử"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Mục tiêu học tập <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          value={formData.learningObjectives}
                          onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                          rows={5}
                          className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          placeholder="Nhập mục tiêu học tập của bài học..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Đề cương <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          value={formData.contentOutline}
                          onChange={(e) => setFormData({ ...formData, contentOutline: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          placeholder="Nhập đề cương chi tiết của bài học..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Khái niệm chính <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          value={formData.keyConcepts}
                          onChange={(e) => setFormData({ ...formData, keyConcepts: e.target.value })}
                          rows={5}
                          className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          placeholder="Nhập các khái niệm chính của bài học..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {editingId ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
