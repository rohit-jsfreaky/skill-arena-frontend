export interface Transaction {
  id: number;
  user_id: number;
  username: string;
  email: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  payment_method: string;
  account_details?: string;
  transaction_id?: string;
  admin_remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepositResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
}

export interface WithdrawRequest {
  amount: number;
  userId: string | number;
  accountType: string;
  accountDetails: string;
}

export interface WithdrawRequestResponse {
  success: boolean;
  message?: string;
}

export interface PaymentHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface TransactionListResponse {
  success: boolean;
  data: Transaction[];
  message?: string;
}

export interface PaginatedTransactionsResponse {
  success: boolean;
  data: Transaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  message?: string;
}