export interface StockMovement {
  id: number;
  type: 'in' | 'out';
  date: string;
  quantity: number;
  productId: number;
  productName: string;
  orderId?: number;
  stockSlotId?: number;
  lotNumber: string;
}

export interface StockMovementPage {
  content: StockMovement[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
