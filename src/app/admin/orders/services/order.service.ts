import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order, CreateOrderRequest } from '../../../core/models/order.model';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../env';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiService = inject(ApiService<Order>);
  private http = inject(HttpClient);
  private baseUrl = environment.api_base_url;

  getOrders(): Observable<Order[]> {
    return this.apiService.getAll('/orders');
  }

  getOrder(id: number): Observable<Order> {
    return this.apiService.getById('/orders', id);
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/create`, request);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.apiService.update('/orders', id, { status });
  }

  receiveOrder(id: number): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${id}/receive`, {});
  }

  getPendingOrdersCount(): Observable<number> {
    return this.getOrders().pipe(
      map(orders => orders.filter(o => o.status === 'pending').length)
    );
  }
}
