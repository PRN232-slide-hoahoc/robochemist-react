import { int } from "zod/v4";

export interface WalletDto {
  walletId: string;
  userId: string;
  balance: number;
  updateAt: string;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  userName: string | null;
  walletId: string;
  transactionType: string;
  amount: number;
  method: string;
  status: string;
  referenceId: string | null;
  referenceType: string | null;
  description: string | null;
  createAt: string;
  updateAt: string;
}

export interface DepositRequest {
  amount: number;
}
export interface DepositCallback {
    vnp_Amount: number;
    vnp_OrderInfo: string;
}
