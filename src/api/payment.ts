import apiClient from "@/utils/apiClient";
import {
  CreateDepositResponse,
  PaymentHandlerResponse,
  VerifyPaymentResponse,
  WithdrawRequest,
  WithdrawRequestResponse,
  TransactionListResponse,
} from "@/interface/payment";

export const createDeposit = async (
  amount: number,
  userId: number
): Promise<CreateDepositResponse> => {
  try {
    const response = await apiClient.post("api/payment/create-deposit", {
      amount,
      userId,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating deposit:", error);
    return {
      success: false,
      message: "Failed to create deposit",
    };
  }
};

export const verifyPayment = async (
  paymentData: PaymentHandlerResponse,
  userId: number,
  amount: number
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await apiClient.post("api/payment/verify-payment", {
      ...paymentData,
      userId,
      amount,
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      success: false,
      message: "Failed to verify payment",
    };
  }
};

export const requestWithdrawal = async (
  data: WithdrawRequest
): Promise<WithdrawRequestResponse> => {
  try {
    const response = await apiClient.post(
      "api/payment/request-withdrawal",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    return {
      success: false,
      message: "Failed to submit withdrawal request",
    };
  }
};

export const getUserTransactions = async (
  userId: number,
  filter: string,
): Promise<TransactionListResponse> => {
  try {
    const response = await apiClient.get(
      `api/payment/user-transactions?userId=${userId}&type=${filter}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch transactions",
    };
  }
};
