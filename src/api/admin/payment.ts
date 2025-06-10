import { PaginatedTransactionsResponse, Transaction } from "@/interface/payment";
import api from "@/utils/api";

export const getAdminTransactions = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  type?: string,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<PaginatedTransactionsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    
    if (status) queryParams.append("status", status);
    if (type) queryParams.append("type", type);
    if (search) queryParams.append("search", search);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    
    const response = await api.get(`api/payment/admin/transactions?${queryParams.toString()}&admin=true`);

    return {
      success: true,
      data: response.data.data as Transaction[],
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      success: false,
      message: 'Failed to fetch transactions',
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
};

export const processWithdrawal = async (
  transactionId: number,
  status: 'completed' | 'rejected',
  adminRemarks?: string
) => {
  try {
    const response = await api.post('api/payment/admin/process-withdrawal?admin=true', {
      transactionId,
      status,
      adminRemarks
    });

    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return {
      success: false,
      message: 'Failed to process withdrawal'
    };
  }
};