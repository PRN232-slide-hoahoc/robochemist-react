import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { walletService } from '@/services/wallet/walletService';
import { useAuth } from '@/hooks/useAuth';
import { DepositForm } from '@/components/features/wallet/DepositForm';
import { TransactionHistory } from '@/components/features/wallet/TransactionHistory';
import { BalanceBox } from '@/components/features/wallet/BalanceBox';

type WalletTransaction = {
  transactionId: string;
  amount: number;
  transactionType?: string;
  status?: string;
  createAt?: string;
  referenceId?: string | null;
};

export const WalletPage: React.FC = () => {


  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Ví của bạn</h1>
          <p className="text-sm text-gray-500">Quản lý số dư, giao dịch và nạp/rút tiền.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="pb-6 space-y-12">
            <Card>
            <CardContent className="pt-6">
              <BalanceBox />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <DepositForm />
            </CardContent>
          </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <TransactionHistory/>
            </CardContent>
          </Card>
        </div>

      </Container>
    </Layout>
  );
};

export default WalletPage;
