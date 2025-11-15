import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { walletService } from '@/services/wallet/walletService';
import { ROUTES } from '@/utils/constants/routes';

type PaymentStatus = 'processing' | 'success' | 'failed';

export const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [message, setMessage] = useState<string>('Đang xử lý thanh toán...');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    processPaymentCallback();
  }, []);

  const processPaymentCallback = async () => {
    try {
      // Extract VNPay callback parameters
      const callbackParams = extractVNPayParams();
      
      if (!callbackParams || Object.keys(callbackParams).length === 0) {
        setStatus('failed');
        setMessage('Không tìm thấy thông tin thanh toán');
        return;
      }

      // Store payment info for display
      setPaymentInfo(callbackParams);

      // Send only required parameters to backend
      const backendPayload = {
        vnp_Amount: parseInt(callbackParams.vnp_Amount),
        vnp_OrderInfo: callbackParams.vnp_OrderInfo,
      };

      // Send callback data to backend
      await walletService.depositCallback(backendPayload);

      // Check response code from VNPay
      const responseCode = callbackParams.vnp_ResponseCode || callbackParams.vnp_TransactionStatus;
      
      if (responseCode === '00') {
        setStatus('success');
        setMessage('Nạp tiền thành công!');
      } else {
        setStatus('failed');
        setMessage(getVNPayErrorMessage(responseCode));
      }
    } catch (error: any) {
      console.error('Payment callback error:', error);
      setStatus('failed');
      setMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const extractVNPayParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    
    // Extract all parameters from URL that start with 'vnp_'
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('vnp_')) {
        params[key] = value;
      }
    }

    // Log for debugging
    console.log('Extracted VNPay parameters:', params);

    return params;
  };

  const getVNPayErrorMessage = (code: string): string => {
    const errorMessages: Record<string, string> = {
      '01': 'Giao dịch chưa hoàn tất',
      '02': 'Giao dịch bị lỗi',
      '04': 'Giao dịch bị đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)',
      '05': 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
      '06': 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
      '07': 'Giao dịch bị nghi ngờ gian lận',
      '09': 'Giao dịch hoàn trả bị từ chối',
      '10': 'Đã giao hàng chưa nhận được tiền',
      '11': 'Đã hủy giao dịch và hoàn tiền',
      '12': 'Đã hoàn tiền',
      '24': 'Giao dịch bị hủy',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Tài khoản vượt quá giới hạn giao dịch',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Giao dịch vượt quá số lần nhập mã OTP',
      '99': 'Giao dịch thất bại',
    };

    return errorMessages[code] || `Giao dịch thất bại với mã lỗi: ${code}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // VNPay format: yyyyMMddHHmmss
    if (dateString && dateString.length === 14) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const minute = dateString.substring(10, 12);
      const second = dateString.substring(12, 14);
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }
    return dateString;
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {status === 'processing' && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Đang xử lý thanh toán
                  </h2>
                  <p className="text-gray-600">{message}</p>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-10 w-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    {message}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Giao dịch của bạn đã được xử lý thành công
                  </p>

                  {paymentInfo && (
                    <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Chi tiết giao dịch</h3>
                      
                      {paymentInfo.vnp_Amount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số tiền:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(parseInt(paymentInfo.vnp_Amount) / 100)}
                          </span>
                        </div>
                      )}

                      {paymentInfo.vnp_TxnRef && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã giao dịch:</span>
                          <span className="font-mono text-sm">{paymentInfo.vnp_TxnRef}</span>
                        </div>
                      )}

                      {paymentInfo.vnp_TransactionNo && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã GD VNPay:</span>
                          <span className="font-mono text-sm">{paymentInfo.vnp_TransactionNo}</span>
                        </div>
                      )}

                      {paymentInfo.vnp_BankCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngân hàng:</span>
                          <span className="font-medium">{paymentInfo.vnp_BankCode}</span>
                        </div>
                      )}

                      {paymentInfo.vnp_BankTranNo && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã GD ngân hàng:</span>
                          <span className="font-mono text-sm">{paymentInfo.vnp_BankTranNo}</span>
                        </div>
                      )}

                      {paymentInfo.vnp_CardType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại thẻ:</span>
                          <span className="font-medium">{paymentInfo.vnp_CardType}</span>
                        </div>
                      )}

                      {paymentInfo.vnp_PayDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian:</span>
                          <span className="text-sm">{formatDate(paymentInfo.vnp_PayDate)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => navigate(ROUTES.WALLET)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Về trang ví
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.HOME)}
                      variant="outline"
                    >
                      Về trang chủ
                    </Button>
                  </div>
                </div>
              )}

              {status === 'failed' && (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-10 w-10 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">
                    Thanh toán thất bại
                  </h2>
                  <p className="text-gray-600 mb-6">{message}</p>

                  {paymentInfo && (
                    <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Thông tin giao dịch</h3>
                      
                      {paymentInfo.vnp_TxnRef && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã giao dịch:</span>
                          <span className="font-mono text-sm">{paymentInfo.vnp_TxnRef}</span>
                        </div>
                      )}

                      {paymentInfo.vnp_ResponseCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã lỗi:</span>
                          <span className="font-mono text-sm text-red-600">
                            {paymentInfo.vnp_ResponseCode}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => navigate(ROUTES.WALLET)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Thử lại
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.HOME)}
                      variant="outline"
                    >
                      Về trang chủ
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};

export default PaymentCallbackPage;
