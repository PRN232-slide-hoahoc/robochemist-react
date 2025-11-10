import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { axiosInstance } from '@/services/api/axios.config';
import { endpoints } from '@/services/api/endpoints';

type SyllabusItem = { id: string; lesson: string; topicName?: string };
type SlideResult = {
  generatedSlideId: string;
  filePath?: string | null;
  slideCount?: number | null;
  generationStatus?: string | null;
  jsonContent?: string | null;
};

export const SlidesPage: React.FC = () => {
  const navigate = useNavigate();
  const [syllabuses, setSyllabuses] = useState<SyllabusItem[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState<string | null>(null);
  const [numberOfSlides, setNumberOfSlides] = useState<number>(10);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SlideResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const resp = await axiosInstance.get(endpoints.SLIDES.SYLLABUSES);
        const data = resp.data?.data ?? resp.data;
        if (Array.isArray(data)) {
          setSyllabuses(data.map((s: any) => ({ id: s.id ?? s.id?.toString(), lesson: s.lesson ?? s.lesson, topicName: s.topicName ?? s.topic?.name })));
        }
      } catch (err) {
        // ignore - show empty list
      }
    };

    fetchSyllabuses();
  }, []);

  const handleGenerate = async () => {
    if (!selectedSyllabus) {
      setError('Vui lòng chọn một syllabus');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        SyllabusId: selectedSyllabus,
        NumberOfSlides: numberOfSlides,
        AiPrompt: aiPrompt || undefined,
      };

      const resp = await axiosInstance.post(endpoints.SLIDES.GENERATE, payload);
      const data = resp.data?.data ?? resp.data;
      if (data) {
        setResult({
          generatedSlideId: data.generatedSlideId ?? data.GeneratedSlideId ?? '',
          filePath: data.filePath ?? data.FilePath,
          slideCount: data.slideCount ?? data.SlideCount,
          generationStatus: data.generationStatus ?? data.GenerationStatus,
          jsonContent: data.jsonContent ?? data.JsonContent,
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Tạo slide thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Slides</h1>
          <p className="text-sm text-gray-600">Soạn slide nhanh chóng bằng AI hoặc template.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tạo slide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Chọn syllabus</label>
                <select className="w-full rounded-lg border px-3 py-2 mt-1" value={selectedSyllabus ?? ''} onChange={(e) => setSelectedSyllabus(e.target.value || null)}>
                  <option value="">-- Chọn syllabus --</option>
                  {syllabuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.lesson}{s.topicName ? ` — ${s.topicName}` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <Input label="Số lượng slide" type="number" value={numberOfSlides} onChange={(e) => setNumberOfSlides(Number(e.target.value))} />
              </div>

              <div>
                <Input label="Prompt (tùy chọn)" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} helperText="Tùy chỉnh prompt cho AI (nếu để trống, hệ thống dùng nội dung syllabus)." />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGenerate} disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo slide'}</Button>
                <Button variant="outline" onClick={() => navigate('/')}>Quay lại Home</Button>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              {result && (
                <div className="mt-4">
                  <h4 className="font-semibold">Kết quả</h4>
                  <p>Trạng thái: {result.generationStatus ?? '—'}</p>
                  <p>Số slide: {result.slideCount ?? '—'}</p>
                  {result.filePath && (
                    <div className="mt-2">
                      <a className="text-blue-600 underline" href={result.filePath} target="_blank" rel="noreferrer">Tải file slide</a>
                    </div>
                  )}
                  {result.jsonContent && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Xem nội dung JSON</summary>
                      <pre className="max-h-64 overflow-auto p-2 bg-gray-100 rounded mt-2 text-xs">{result.jsonContent}</pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default SlidesPage;
