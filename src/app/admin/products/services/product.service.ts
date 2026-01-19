import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../../core/models';
import { environment } from '../../../../env';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiService = inject(ApiService<Product>);
  private http = inject(HttpClient);
  private baseUrl = environment.api_base_url;

  getProducts(): Observable<Product[]> {
    return this.apiService.getAll('/products');
  }

  getProduct(id: number): Observable<Product> {
    return this.apiService.getById('/products', id);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<any> {
    return this.apiService.create('/products/create', product as any);
  }

  updateProduct(id: number, product: Partial<Omit<Product, 'id'>>): Observable<any> {
    return this.apiService.update('/products', id, product as any);
  }

  deleteProduct(id: number): Observable<any> {
    return this.apiService.delete('/products', id);
  }

  getActiveProductsCount(): Observable<number> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.currentStock > 0).length)
    );
  }

  getStockAlertsCount(): Observable<number> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.currentStock < p.reorderPoint).length)
    );
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.apiService.getAll('/products/lowstock');
  }
}
