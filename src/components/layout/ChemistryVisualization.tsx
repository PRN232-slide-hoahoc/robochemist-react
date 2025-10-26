import React from 'react';
import { motion, cubicBezier } from 'framer-motion';

export const ChemistryVisualization: React.FC = () => {
  // Animated molecule
  const moleculeAnimation = {
    initial: { x: 60, y: 80 },
    animate: {
      x: [60, 200, 280, 200, 60],
      y: [80, 40, 80, 120, 80],
      rotate: [0, 90, 180, 270, 360]
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: cubicBezier(0.42, 0, 0.58, 1)
    }
  };

  return (
    <motion.div
      className="relative mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      {/* Lab Equipment Background */}
      <div className="relative w-80 h-48 bg-gradient-to-b from-blue-900/40 to-purple-800/30 rounded-lg border-2 border-white/30 shadow-2xl backdrop-blur-sm">
        {/* Beaker outline */}
        <div className="absolute inset-2">
          {/* Main beaker shape */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-3/4 border-2 border-white/50 rounded-b-lg"></div>
          
          {/* Liquid inside */}
          <motion.div
            className="absolute bottom-0 left-1/4 right-1/4 h-2/3 bg-gradient-to-t from-blue-400/30 to-purple-400/20 rounded-b-lg"
            animate={{ 
              height: ['66%', '70%', '66%'],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Measurement lines */}
          <div className="absolute bottom-1/4 left-1/4 right-1/4 h-0.5 bg-white/30"></div>
          <div className="absolute bottom-1/2 left-1/4 right-1/4 h-0.5 bg-white/30"></div>
          <div className="absolute bottom-3/4 left-1/4 right-1/4 h-0.5 bg-white/30"></div>
        </div>

        {/* Test tubes */}
        <div className="absolute right-8 bottom-4 flex space-x-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-16 border border-white/40 rounded-b-full relative"
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              <motion.div
                className={`absolute bottom-0 left-0 right-0 rounded-b-full ${
                  i === 1 ? 'bg-blue-400/40' : i === 2 ? 'bg-purple-400/40' : 'bg-pink-400/40'
                }`}
                style={{ height: `${40 + i * 10}%` }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Animated Molecule */}
        <motion.div
          className="absolute"
          initial={moleculeAnimation.initial}
          animate={moleculeAnimation.animate}
          transition={moleculeAnimation.transition}
        >
          {/* Central atom */}
          <div className="relative w-4 h-4">
            <div className="w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
            
            {/* Orbital electrons */}
            {[0, 120, 240].map((angle) => (
              <motion.div
                key={angle}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
                style={{
                  transformOrigin: '0 0',
                }}
                animate={{
                  rotate: [angle, angle + 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute -left-1 -top-1 w-2 h-2" />
              </motion.div>
            ))}
          </div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-2 bg-blue-400 rounded-full blur-sm opacity-30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Bubbles effect */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${30 + i * 10}%`,
              bottom: '20%'
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Glow effect around container */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-xl blur-xl"></div>
      </div>
    </motion.div>
  );
};
