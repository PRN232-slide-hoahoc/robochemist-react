import React from 'react';
import { motion } from 'framer-motion';
import { Beaker } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
            <Beaker className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
            RoboChemist
          </h1>
          <p className="text-slate-300 text-sm font-medium tracking-wide">Smart Chemistry Learning Platform</p>
        </div>
      </div>
    </motion.div>
  );
};
