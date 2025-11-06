import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { walletService } from '@/services/wallet/walletService';
import { useAuth } from '@/hooks/useAuth';

type WalletTransaction = {
  transactionId: string;
  amount: number;
  transactionType?: string;
  status?: string;
  createAt?: string;
  referenceId?: string | null;
};

export const WalletPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [refundAmount, setRefundAmount] = useState<number | ''>('');
  const [refundReference, setRefundReference] = useState<string | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | ''>(50000);

  const loadWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      try {
        const b = await walletService.getBalance();
        setBalance(b?.balance ?? null);
      } catch (balanceErr) {
        // treat balance errors as wallet-missing; try to create
        try {
          if (user?.id) await walletService.createWallet({ userId: user.id });
          else await walletService.createWallet({});
          const b2 = await walletService.getBalance();
          setBalance(b2?.balance ?? null);
        } catch (createErr) {
          console.warn('Failed to create wallet on load', createErr);
          setBalance(null);
        }
      }

      try {
        const t = await walletService.getAllTransactions();
        setTransactions(Array.isArray(t) ? t : []);
      } catch (txErr) {
        console.warn('Failed to fetch wallet transactions', txErr);
        setTransactions([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Không thể tải dữ liệu ví');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadWallet();
  }, [isAuthenticated]);

  const handleCreateDeposit = async () => {
    try {
  const amount = typeof depositAmount === 'number' ? depositAmount : 10000;
      const url = await walletService.createDepositUrl({ userId: user?.id, amount });
      if (typeof url === 'string') window.open(url, '_blank');
      else alert('Không nhận được URL nạp tiền');
    } catch (err: any) {
      console.error('Create deposit URL error', err);
      alert(err?.response?.data?.message || 'Tạo đường dẫn nạp tiền thất bại');
    }
  };

  const handleRefund = async () => {
    if (!refundAmount || refundAmount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ để hoàn tiền');
      return;
    }

    setIsRefunding(true);
    try {
      await walletService.createRefundRequest({ referenceId: refundReference ?? null, amount: refundAmount });
      alert('Yêu cầu hoàn tiền đã gửi');
      // refresh wallet state
      await loadWallet();
      // clear form
      setRefundAmount('');
      setRefundReference(null);
    } catch (err: any) {
      console.error('Refund error', err);
      alert(err?.response?.data?.message || 'Yêu cầu hoàn tiền thất bại');
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Ví của bạn</h1>
          <p className="text-sm text-gray-500">Quản lý số dư, giao dịch và nạp/rút tiền.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600">Số dư hiện tại</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">{balance != null ? `${balance}` : '—'}</p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600">Giao dịch</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mt-1 flex flex-col gap-4">
                <div>
                  <div className="mb-2 text-sm font-medium text-gray-700">Nạp tiền (số tiền VND)</div>
                  <div className="flex gap-2 items-end">
                    <div className="min-w-0 flex-1">
                      <Input
                        type="number"
                        fullWidth
                        label="Số tiền nạp"
                        value={depositAmount === '' ? '' : String(depositAmount)}
                        onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Button onClick={handleCreateDeposit}>Tạo đường dẫn nạp tiền</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-gray-700">Hoàn tiền</div>
                  <div className="flex gap-2 items-end">
                    <div className="min-w-0 w-36">
                      <Input
                        type="number"
                        label="Số tiền hoàn"
                        value={refundAmount === '' ? '' : String(refundAmount)}
                        onChange={(e) => setRefundAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={refundReference ?? ''}
                        onChange={(e) => setRefundReference(e.target.value || null)}
                      >
                        <option value="">-- Chọn giao dịch (tuỳ chọn) --</option>
                        {transactions
                          .filter((tx) => tx.transactionType === 'Thanh toán')
                          .map((tx) => (
                            <option key={tx.transactionId} value={tx.referenceId ?? 'N/A'}>
                              {tx.referenceId ?? 'N/A'} — {tx.amount}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <Button variant="outline" onClick={handleRefund} disabled={isRefunding}>
                        Gửi hoàn tiền
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && transactions.length === 0 && <p className="text-gray-600">Không có giao dịch nào</p>}

            <ul className="mt-4 space-y-3">
              {transactions.map((tx) => (
                <li key={tx.transactionId} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{tx.transactionType ?? 'Giao dịch'}</div>
                    <div className="text-sm text-gray-500">Ref: {tx.referenceId ?? '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</div>
                    <div className="text-sm text-gray-400">{tx.createAt ? new Date(tx.createAt).toLocaleString() : '—'}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default WalletPage;
