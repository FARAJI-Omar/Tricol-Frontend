// Request types 
export interface GoodsOutItemRequest {
  productId: number;
  quantity: number;
  note?: string;
}

export interface CreateGoodsOutRequest {
  exitDate: string | Date;
  destinationWorkshop: string;
  reason: 'PRODUCTION' | 'MAINTENANCE' | 'OTHER';
  comment?: string;
  items: GoodsOutItemRequest[];
}

// Response types 
export interface GoodsOutItem {
  id?: number;
  productId: number;
  productName?: string;
  productReference?: string;
  requestedQuantity: number;
  actualQuantity?: number | null;
  note?: string;
}

export interface GoodsOut {
  id?: number;
  slipNumber?: string;
  exitDate: string | Date;
  destinationWorkshop: string;
  reason: 'PRODUCTION' | 'MAINTENANCE' | 'OTHER';
  status: 'DRAFT' | 'VALIDATED' | 'CANCELLED';
  comment?: string;
  items: GoodsOutItem[];
  createdAt?: string;
  validatedAt?: string | null;
  cancelledAt?: string | null;
  createdBy?: string;
  validatedBy?: string | null;
  cancelledBy?: string | null;
}
