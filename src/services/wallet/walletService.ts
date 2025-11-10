import { axiosInstance } from '@/services/api/axios.config';
import { ApiResponse } from '@/types/api.types';
import { endpoints } from '@/services/api/endpoints';

class WalletService {
  /**
   * Create a deposit checkout URL
   */
  async createDepositUrl(payload: any): Promise<string> {
    const resp = await axiosInstance.post<ApiResponse<string>>(endpoints.WALLET.CREATE_DEPOSIT_URL, payload);
    return resp.data?.data;
  }

  /**
   * Deposit callback (webhook)
   */
  async depositCallback(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.DEPOSIT_CALLBACK, payload);
    return resp.data;
  }

  /**
   * Create a payment request (internal)
   */
  async createPaymentRequest(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.CREATE_PAYMENT_REQUEST, payload);
    return resp.data;
  }

  /**
   * Create a refund request
   */
  async createRefundRequest(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.CREATE_REFUND_REQUEST, payload);
    return resp.data;
  }

  /**
   * Get all transactions
   */
  async getAllTransactions(): Promise<any[]> {
    const resp = await axiosInstance.get<ApiResponse<any[]>>(endpoints.WALLET.GET_ALL_TRANSACTIONS);
    return resp.data?.data;
  }

  /**
   * Get wallets (for admin or listing)
   */
  async getWallet(): Promise<any> {
    const resp = await axiosInstance.get<ApiResponse<any>>(endpoints.WALLET.WALLETS);
    return resp.data?.data;
  }

  /**
   * Create wallet for user
   */
  async createWallet(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.WALLETS, payload);
    return resp.data?.data;
  }

  /**
   * Get wallet balance for current user
   */
  async getBalance(): Promise<any> {
    const resp = await axiosInstance.get<ApiResponse<any>>(endpoints.WALLET.WALLETS_BALANCE);
    return resp.data?.data;
  }

  /**
   * Create a payment (wallet payment)
   */
  async createWalletPayment(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.WALLETS_PAYMENT, payload);
    return resp.data?.data;
  }

  /**
   * Create refund via wallets endpoint
   */
  async createWalletRefund(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.WALLETS_REFUND, payload);
    return resp.data?.data;
  }

  /**
   * Get transactions by reference id
   */
  async getTransactionsByReference(referenceId: string): Promise<any> {
    const resp = await axiosInstance.get<ApiResponse<any>>(endpoints.WALLET.TRANSACTIONS_BY_REFERENCE(referenceId));
    return resp.data?.data;
  }
}

export const walletService = new WalletService();
