import { axiosInstance as apiClient } from '../api/axios.config';
import type { ApiResponse } from '@/types/api.types';
import type {
  Order,
  OrderSummary,
  OrderStatistics,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  PagedOrderResult,
} from '@/types/order.types';

const ORDER_API_BASE = '/template/v1/orders';

/**
 * Order Service
 * Handles all order-related API calls
 */
export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      ORDER_API_BASE,
      request
    );
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      `${ORDER_API_BASE}/${orderId}`
    );
    return response.data.data;
  },

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      `${ORDER_API_BASE}/by-number/${orderNumber}`
    );
    return response.data.data;
  },

  /**
   * Get all orders for current user
   */
  async getUserOrders(userId: string): Promise<OrderSummary[]> {
    const response = await apiClient.get<ApiResponse<OrderSummary[]>>(
      `${ORDER_API_BASE}/user/${userId}`
    );
    return response.data.data;
  },

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedOrderResult> {
    const response = await apiClient.get<ApiResponse<PagedOrderResult>>(
      ORDER_API_BASE,
      {
        params: { pageNumber, pageSize },
      }
    );
    return response.data.data;
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    request: UpdateOrderStatusRequest
  ): Promise<Order> {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `${ORDER_API_BASE}/${orderId}/status`,
      request
    );
    return response.data.data;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      `${ORDER_API_BASE}/${orderId}/cancel`
    );
    return response.data.data;
  },

  /**
   * Get order statistics for user
   */
  async getOrderStatistics(userId: string): Promise<OrderStatistics> {
    const response = await apiClient.get<ApiResponse<OrderStatistics>>(
      `${ORDER_API_BASE}/user/${userId}/statistics`
    );
    return response.data.data;
  },
};
