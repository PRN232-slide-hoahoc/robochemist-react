import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { axiosInstance } from '@/services/api/axios.config';
import { endpoints } from '@/services/api/endpoints';

type TemplateItem = { templateId: string; templateName?: string; isPremium?: boolean };

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number | ''>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [price, setPrice] = useState<number | ''>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get(endpoints.TEMPLATE.TEMPLATES);
        const data = resp.data?.data?.items ?? resp.data?.data ?? resp.data;
        setTemplates(Array.isArray(data) ? data : []);
      } catch (err) {
        // ignore; show empty state
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleFileSelect = () => fileInputRef.current?.click();

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      // auto-fill template name if empty
      if (!templateName) setTemplateName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    const file = selectedFile;
    if (!file) {
      alert('Vui lòng chọn file trước khi tải lên');
      return;
    }

    // client-side validation
    const allowed = ['.pptx', '.ppt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Only .pptx and .ppt files are allowed');
      return;
    }
    const maxBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxBytes) {
      alert('File size must not exceed 50MB');
      return;
    }

    if (!templateName) {
      alert('Template name is required');
      return;
    }

  const form = new FormData();
  form.append('File', file);
    form.append('TemplateName', templateName);
    if (description) form.append('Description', description);
    if (slideCount !== '') form.append('SlideCount', String(slideCount));
    form.append('IsPremium', String(isPremium));
    if (isPremium && price !== '') form.append('Price', String(price));

    try {
      setLoading(true);
      // Override the default JSON content-type for this request so FormData is sent as multipart/form-data
      // (axiosInstance has a global 'application/json' header). Pass multipart/form-data so the server
      // treats this request as a file upload. The browser/axios will include the boundary.
      const uploadResp = await axiosInstance.post(endpoints.TEMPLATE.TEMPLATE_UPLOAD, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const created = uploadResp.data?.data ?? uploadResp.data;
      // refresh list
      const resp = await axiosInstance.get(endpoints.TEMPLATE.TEMPLATES);
      const data = resp.data?.data?.items ?? resp.data?.data ?? resp.data;
      setTemplates(Array.isArray(data) ? data : []);
  // reset form
      setTemplateName('');
      setDescription('');
      setSlideCount('');
      setIsPremium(false);
      setPrice('');
  setSelectedFile(null);

      alert('Tải lên thành công' + (created?.templateId ? ` (ID: ${created.templateId ?? created.TemplateId})` : ''));
    } catch (err: any) {
      console.error('Upload error', err);
      const msg = err?.response?.data?.message || err?.response?.data?.errors || err.message || 'Tải lên thất bại';
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-sm text-gray-600">Duyệt và quản lý template slide của bạn.</p>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            <div className="flex-1 grid gap-2 sm:grid-cols-2">
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Tên template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <input className="rounded-lg border px-3 py-2" placeholder="Số slide (tuỳ chọn)" value={slideCount === '' ? '' : String(slideCount)} onChange={(e) => setSlideCount(e.target.value === '' ? '' : Number(e.target.value))} />
              <div className="flex items-center gap-2">
                <input id="isPremium" type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
                <label htmlFor="isPremium" className="text-sm">Premium</label>
                {isPremium && (
                  <input className="rounded-lg border px-3 py-2 ml-2" placeholder="Giá (VND)" value={price === '' ? '' : String(price)} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
                )}
              </div>
              <textarea className="rounded-lg border px-3 py-2 sm:col-span-2" placeholder="Mô tả (tùy chọn)" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex flex-col items-start gap-2">
              <input ref={fileInputRef} type="file" accept=".ppt,.pptx" className="hidden" onChange={onFilePicked} />
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Button onClick={handleFileSelect} variant="outline">Chọn file .pptx/.ppt</Button>
                <Button onClick={handleUpload} disabled={!selectedFile || loading}>{loading ? 'Đang tải...' : 'Tải lên'}</Button>
                <Button onClick={() => navigate('/')}>Quay lại Home</Button>
              </div>
              {selectedFile && <div className="text-sm text-gray-600 mt-2">Đã chọn: {selectedFile.name}</div>}
            </div>
          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && <p>Đang tải...</p>}
          {!loading && templates.length === 0 && (
            <Card>
              <CardContent>
                <p className="text-gray-600">Chưa có template nào.</p>
              </CardContent>
            </Card>
          )}

          {templates.map((t) => (
            <Card key={t.templateId} hover>
              <CardHeader>
                <CardTitle>{t.templateName ?? 'Template'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{t.isPremium ? 'Premium' : 'Miễn phí'}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" onClick={() => handleDownload(t.templateId, t.templateName)}>Tải về</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default TemplatesPage;
