import React from 'react';
import { BackgroundEffects } from '../../components/layout/BackgroundEffects';
import { HeroSection } from '../../components/layout/HeroSection';
import { LoginForm } from '../../components/features/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Main Container - Centered Layout */}
      <div className="min-h-screen flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-7xl flex items-center justify-center gap-8 lg:gap-16">
          {/* Left Side - Hero Section */}
          <HeroSection />

          {/* Right Side - Login Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
