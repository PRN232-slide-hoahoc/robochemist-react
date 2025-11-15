import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Phone, AlertCircle } from 'lucide-react';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_CONFIG } from '@/utils/constants/config';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Register validation schema
const registerSchema = z.object({
  fullname: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const LoginForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  // Only require / render reCAPTCHA when a site key is configured
  const requireRecaptcha = Boolean(RECAPTCHA_CONFIG.SITE_KEY);
  
  const { login, isLoading: loginLoading } = useLogin();
  const { register, isLoading: registerLoading } = useRegister();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setFormError('');
    try {
      await login(data);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Đăng nhập thất bại. Vui lòng thử lại.';
      setFormError(errorMessage);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setFormError('');
    setSuccessMessage('');
    
    // Kiểm tra reCAPTCHA (chỉ khi cấu hình site key)
    if (requireRecaptcha && !recaptchaToken) {
      setFormError('Vui lòng xác nhận bạn không phải là robot.');
      return;
    }
    
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      // Đăng ký thành công - chuyển về form login và hiển thị thông báo
      setIsSignUp(false);
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      registerForm.reset();
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Đăng ký thất bại. Vui lòng thử lại.';
      setFormError(errorMessage);
      // Reset reCAPTCHA khi có lỗi
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    }
  };

  const handleToggle = (newIsSignUp: boolean) => {
    setIsSignUp(newIsSignUp);
    setFormError('');
    setSuccessMessage('');
    setRecaptchaToken(null);
    loginForm.reset();
    registerForm.reset();
    // Reset reCAPTCHA khi chuyển form
    if (requireRecaptcha && recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const isLoading = loginLoading || registerLoading;

  return (
    <motion.div
      className="w-full max-w-sm flex items-center justify-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
    >
      <div className="w-full">
        {/* Form Container */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Form Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Tạo Tài Khoản' : 'Chào Mừng Trở Lại'}
            </h3>
            <p className="text-slate-300 text-sm">
              {isSignUp ? 'Tham gia RoboChemist để bắt đầu học tập' : 'Đăng nhập vào tài khoản của bạn'}
            </p>
          </motion.div>

          {/* Toggle Buttons */}
          <div className="relative flex rounded-xl bg-white/5 p-1 mb-6">
            {/* Sliding Background */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
              initial={false}
              animate={{
                x: isSignUp ? '100%' : '0%',
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 60,
              }}
              style={{ width: '50%' }}
            />
            
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`relative z-10 flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 ${
                !isSignUp ? 'text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`relative z-10 flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 ${
                isSignUp ? 'text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence mode="wait">
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-400 text-sm">{successMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={isSignUp ? registerForm.handleSubmit(handleRegisterSubmit) : loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-4"
            >
              {/* Fullname Field (Register Only) */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      {...registerForm.register('fullname')}
                      placeholder="Nhập họ và tên"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  {registerForm.formState.errors.fullname && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {registerForm.formState.errors.fullname.message}
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    {...(isSignUp ? registerForm.register('email') : loginForm.register('email'))}
                    placeholder="Nhập email của bạn"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                {(isSignUp ? registerForm.formState.errors.email : loginForm.formState.errors.email) && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {(isSignUp ? registerForm.formState.errors.email?.message : loginForm.formState.errors.email?.message)}
                  </motion.p>
                )}
              </div>

              {/* Phone Field (Register Only) */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Số điện thoại (tùy chọn)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      {...registerForm.register('phone')}
                      placeholder="Nhập số điện thoại"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    {...(isSignUp ? registerForm.register('password') : loginForm.register('password'))}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                {(isSignUp ? registerForm.formState.errors.password : loginForm.formState.errors.password) && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {(isSignUp ? registerForm.formState.errors.password?.message : loginForm.formState.errors.password?.message)}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Field (Register Only) */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      {...registerForm.register('confirmPassword')}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {registerForm.formState.errors.confirmPassword.message}
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Forgot Password (Sign In Only) */}
              {!isSignUp && (
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              {/* reCAPTCHA (Register Only) */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                >
                  {/* Render reCAPTCHA only when a site key is configured */}
                  {requireRecaptcha ? (
                    <div className="scale-90 origin-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_CONFIG.SITE_KEY}
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                        theme="dark"
                      />
                    </div>
                  ) : null}
                </motion.div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Đăng Ký' : 'Đăng Nhập'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            </p>
            <button
              type="button"
              onClick={() => handleToggle(!isSignUp)}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm hover:underline mt-1"
            >
              {isSignUp ? 'Đăng nhập tại đây' : 'Tạo tài khoản'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
