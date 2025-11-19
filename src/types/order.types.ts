/**
 * Order Types
 */

export interface Order {
  orderId: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentTransactionId?: string;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  orderDetailId: string;
  orderId: string;
  templateId: string;
  templateName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  itemCount: number;
  templateName?: string;
  createdAt: string;
}

export interface OrderStatistics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

export interface CreateOrderRequest {
  userId: string;
  items: CreateOrderItem[];
  notes?: string;
}

export interface CreateOrderItem {
  templateId: string;
  quantity: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
  paymentTransactionId?: string;
}

export interface PagedOrderResult {
  items: OrderSummary[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
