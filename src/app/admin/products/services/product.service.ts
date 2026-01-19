import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../core/models';
import { environment } from '../../../../env';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.api_base_url;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<any> {
    return this.http.post(`${this.baseUrl}/products/create`, product, { responseType: 'text' });
  }

  updateProduct(id: number, product: Partial<Omit<Product, 'id'>>): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, product, { responseType: 'text' });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, { responseType: 'text' });
  }
}
