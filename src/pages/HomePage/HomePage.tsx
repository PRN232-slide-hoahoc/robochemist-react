import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { axiosInstance } from '@/services/api/axios.config';
import { endpoints } from '@/services/api/endpoints';

type TemplateItem = {
  templateId: string;
  templateName?: string;
  isPremium?: boolean;
  price?: number;
};

export const HomePage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await axiosInstance.get(endpoints.TEMPLATE.TEMPLATES);
        // expect paged result or array - try to be defensive
        const data = resp.data?.data?.items ?? resp.data?.data ?? resp.data;
        setTemplates(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Không thể tải templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleDownload = async (id: string, name?: string) => {
    try {
      const resp = await axiosInstance.get(endpoints.TEMPLATE.TEMPLATE_DOWNLOAD(id), { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = name ? `${name}.pptx` : 'template.pptx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Tải về thất bại');
    }
  };

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('File', file);
    // add minimal metadata if required
    form.append('TemplateName', file.name);

    try {
      setLoading(true);
      await axiosInstance.post(endpoints.TEMPLATE.TEMPLATE_UPLOAD, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // refresh templates
      const resp = await axiosInstance.get(endpoints.TEMPLATE.TEMPLATES);
      const data = resp.data?.data?.items ?? resp.data?.data ?? resp.data;
      setTemplates(Array.isArray(data) ? data : []);
      alert('Tải lên thành công');
    } catch (err: any) {
      console.error('Upload error', err);
      alert(err?.response?.data?.message || 'Tải lên thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">RoboChemist</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Quản lý templates, tạo slide và đề thi tự động.</p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div />
          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept=".ppt,.pptx" className="hidden" onChange={handleUpload} />
            <Button onClick={handleFileSelect} variant="outline">Tải template lên</Button>
            <Button onClick={() => window.location.href = '/dashboard'}>Đi tới Dashboard</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && <p>Đang tải...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {templates.length === 0 && !loading ? (
            <Card>
              <CardContent>
                <p className="text-gray-600">Chưa có template nào. Bạn có thể tải template lên.</p>
              </CardContent>
            </Card>
          ) : (
            templates.map((t) => (
              <Card key={t.templateId} hover>
                <CardHeader>
                  <CardTitle>{t.templateName ?? 'Template không tên'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">{t.isPremium ? 'Premium' : 'Miễn phí'}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleDownload(t.templateId, t.templateName)}>Tải về</Button>
                    <Button onClick={() => alert('Xem chi tiết (chưa triển khai)')}>Chi tiết</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Container>
    </Layout>
  );
};

