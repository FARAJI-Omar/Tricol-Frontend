export interface Product {
  id?: number;
  reference: string;
  name: string;
  description?: string;
  unitPrice: number;
  category: string;
  measureUnit: string;
  reorderPoint: number;
  currentStock: number;
}
