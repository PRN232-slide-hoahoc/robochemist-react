import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RoboChemist</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} RoboChemist. All rights reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="/about"
              className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
            >
              Về chúng tôi
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
            >
              Liên hệ
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
            >
              Chính sách
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

