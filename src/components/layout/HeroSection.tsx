import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { ChemistryVisualization } from './ChemistryVisualization';

export const HeroSection: React.FC = () => {
  return (
    <motion.div
      className="max-w-2xl flex flex-col justify-center items-center relative px-8"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Logo */}
      <Logo />

      {/* Chemistry Visualization */}
      <ChemistryVisualization />

      {/* Inspirational Quote */}
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="text-3xl font-light text-white mb-4 font-['Montserrat_Alternates'] italic">
          "Where chemistry meets{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium neon-text">
            innovation
          </span>{' '}
          in learning."
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full shadow-lg shadow-blue-400/50"></div>
      </motion.div>
    </motion.div>
  );
};
