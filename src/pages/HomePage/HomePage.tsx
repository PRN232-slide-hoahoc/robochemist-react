import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Atom, 
  FlaskConical, 
  LayoutTemplate, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LayoutTemplate className="w-6 h-6 text-blue-600" />,
      title: "Kho Template Đa Dạng",
      description: "Hàng trăm mẫu slide hóa học được thiết kế sẵn, chuẩn kiến thức và đẹp mắt."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "Soạn Bài Nhanh Chóng",
      description: "Công cụ AI hỗ trợ tạo nội dung, giúp giáo viên tiết kiệm 70% thời gian soạn bài."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Ngân Hàng Đề Thi",
      description: "Tự động tạo đề thi từ kho câu hỏi phong phú, có đáp án chi tiết."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 pt-16 pb-24">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-10 animate-pulse">
          <Atom size={120} className="text-blue-600" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-bounce duration-[3000ms]">
          <FlaskConical size={100} className="text-indigo-600" />
        </div>
        
        <Container>
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                ✨ Công cụ soạn giảng Hóa học 4.0
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                Biến Hóa Học Trở Nên <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Sống Động & Dễ Dàng
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
                RoboChemist giúp giáo viên tạo slide bài giảng ấn tượng, đề thi tự động và mô phỏng phản ứng hóa học chỉ trong vài cú click chuột.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="min-w-[160px] text-lg h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none"
                  onClick={() => navigate('/login')}
                >
                  Bắt đầu ngay
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white dark:bg-slate-900">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Mọi thứ bạn cần cho một tiết học Hóa
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tích hợp đầy đủ các công cụ từ soạn bài, minh họa đến kiểm tra đánh giá
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Interactive Demo Section (Visual Representation) */}
      <div className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Trực quan hóa kiến thức <br />
                <span className="text-blue-600">Không còn khô khan</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Thư viện đa dạng chất hóa học và phản ứng",
                  "Tự động cân bằng phương trình hóa học",
                  "Xuất bài giảng ra nhiều định dạng (PDF, PPTX)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 flex items-center gap-2"
                onClick={() => navigate('/slides')}
              >
                Thử tạo slide ngay <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center py-10">
              <div className="grid grid-cols-5 gap-4 md:gap-6">
                {[
                  { color: "bg-blue-500", delay: 0, values: ["30%", "60%", "30%"] },
                  { color: "bg-rose-500", delay: 0.5, values: ["40%", "75%", "40%"] },
                  { color: "bg-emerald-500", delay: 1, values: ["25%", "55%", "25%"] },
                  { color: "bg-amber-500", delay: 0.7, values: ["35%", "65%", "35%"] },
                  { color: "bg-purple-500", delay: 1.2, values: ["20%", "50%", "20%"] }
                ].map((tube, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-28 md:w-12 md:h-32 border-2 border-slate-300 dark:border-slate-600 border-t-0 rounded-b-full relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg">
                      <motion.div 
                        animate={{ height: tube.values }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: tube.delay }}
                        className={`absolute bottom-0 w-full ${tube.color} opacity-80`}
                      />
                      {/* Bubbles effect */}
                      <motion.div
                        animate={{ y: [0, -60], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: tube.delay + 0.2 }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/70"
                      />
                      <motion.div
                        animate={{ y: [0, -40], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: tube.delay + 0.8 }}
                        className="absolute bottom-4 left-1/3 w-1.5 h-1.5 rounded-full bg-white/60"
                      />
                    </div>
                    <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 opacity-50 blur-sm"></div>
                  </div>
                ))}
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <Container>
          <div className="bg-blue-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 transform rotate-45"><Atom size={64} /></div>
              <div className="absolute bottom-10 right-10 transform -rotate-12"><FlaskConical size={80} /></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Sẵn sàng đổi mới phương pháp dạy Hóa?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Tham gia cùng cộng đồng giáo viên và học sinh sử dụng RoboChemist để nâng cao hiệu quả dạy và học.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 border-none text-lg px-8"
                onClick={() => navigate('/login')}
              >
                Đăng ký miễn phí
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

