import { axiosInstance as apiClient } from '../api/axios.config';
import type { ApiResponse } from '@/types/api.types';
import type { Order, OrderSummary, CreateOrderRequest, PagedOrderResult } from '@/types/order.types';

const ORDER_API_BASE = '/template/v1/orders';

/**
 * Order Service - Handles all order-related API calls
 */
export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(ORDER_API_BASE, request);
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`${ORDER_API_BASE}/${orderId}`);
    return response.data.data;
  },

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string): Promise<OrderSummary[]> {
    const response = await apiClient.get<ApiResponse<OrderSummary[]>>(`${ORDER_API_BASE}/user/${userId}`);
    return response.data.data;
  },

  /**
   * Get all orders (admin/staff)
   */
  async getAllOrders(pageNumber: number = 1, pageSize: number = 10): Promise<PagedOrderResult> {
    const response = await apiClient.get<ApiResponse<PagedOrderResult>>(ORDER_API_BASE, {
      params: { pageNumber, pageSize },
    });
    return response.data.data;
  },
};
