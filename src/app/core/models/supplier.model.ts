export interface Supplier {
  id: number;
  society: string;
  address: string;
  socialReason: string;
  contactAgent: string;
  email: string;
  phone: string;
  city: string;
  ice: string;
  orders: any[];
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors: any;
}
