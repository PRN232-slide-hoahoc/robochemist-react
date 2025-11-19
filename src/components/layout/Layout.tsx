import React, { ReactNode, useEffect, useRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { walletService } from '@/services/wallet/walletService';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const runningRef = useRef(false);

  useEffect(() => {
    // Only run when authenticated. Guard with a ref to avoid concurrent runs on
    // rapid route changes.
    if (!isAuthenticated) return;
    if (runningRef.current) return;

    runningRef.current = true;
    (async () => {
      try {
        // Try to get balance; if it errors, assume wallet missing and create it.
        try {
          await walletService.getBalance();
        } catch (balanceErr) {
          // Attempt to create the wallet for the current user.
          try {
            if (user?.id) {
              await walletService.createWallet();
            } else {
              await walletService.createWallet();
            }
            // Re-fetch balance once after creation (best-effort)
            await walletService.getBalance();
            // note: we do NOT force a full page reload here; components can
            // react to the new backend state. If you prefer a reload, we can
            // re-enable window.location.reload() after creation.
          } catch (createErr) {
            // Log and continue; do not throw so the app stays usable.
            // eslint-disable-next-line no-console
            console.warn('Auto-create wallet failed in Layout:', createErr);
          }
        }
      } finally {
        runningRef.current = false;
      }
    })();
    // Run on location pathname change and when auth state or user changes.
  }, [isAuthenticated, location.pathname, user?.id]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
      <Footer />
    </div>
  );
};

