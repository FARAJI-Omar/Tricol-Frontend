export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id?: number;
  supplierId: number;
  supplierName?: string;
  orderDate: string;
  status: 'pending' | 'validated' | 'cancelled' | 'delivered';
  totalAmount: number;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  supplierId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
