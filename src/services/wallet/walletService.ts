import { axiosInstance } from '@/services/api/axios.config';
import { ApiResponse } from '@/types/api.types';
import { endpoints } from '@/services/api/endpoints';
import { DepositCallback, DepositRequest, Transaction, WalletDto} from '@/types/wallet.type';

class WalletService {
  /**
   * Create a deposit checkout URL
   */
  async createDepositUrl(payload: DepositRequest): Promise<string> {
    const resp = await axiosInstance.post<ApiResponse<string>>(endpoints.WALLET.WALLET_DEPOSIT, payload);
    return resp.data?.data;
  }

  /**
   * Deposit callback
   */
  async depositCallback(payload: DepositCallback): Promise<Transaction> {
    const resp = await axiosInstance.post<ApiResponse<Transaction>>(endpoints.WALLET.WALLET_DEPOSIT_CALLBACK, payload);
    return resp.data?.data;
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
  async getAllTransactions(): Promise<Transaction[]> {
    const resp = await axiosInstance.get<ApiResponse<Transaction[]>>(endpoints.WALLET.GET_ALL_TRANSACTIONS);
    return resp.data?.data;
  }

  /**
   * Get wallet
   */
  async getWallet(): Promise<WalletDto> {
    const resp = await axiosInstance.get<ApiResponse<WalletDto>>(endpoints.WALLET.WALLET);
    return resp.data?.data;
  }

  /**
   * Create wallet for user
   */
  async createWallet(): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.WALLET);
    return resp.data?.data;
  }

  /**
   * Get wallet balance for current user
   */
  async getBalance(): Promise<any> {
    const resp = await axiosInstance.get<ApiResponse<any>>(endpoints.WALLET.WALLET_BALANCE);
    return resp.data?.data;
  }

  /**
   * Create a payment (wallet payment)
   */
  async createWalletPayment(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.WALLET_PAYMENT, payload);
    return resp.data?.data;
  }

  /**
   * Create refund via wallets endpoint
   */
  async createWalletRefund(payload: any): Promise<any> {
    const resp = await axiosInstance.post<ApiResponse<any>>(endpoints.WALLET.WALLET_REFUND, payload);
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
