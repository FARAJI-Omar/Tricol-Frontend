import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StockMovementPage } from '../models/stock-movement.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env';

@Injectable({ providedIn: 'root' })
export class StockMovementService {
  private http = inject(HttpClient);
  private baseUrl = environment.api_base_url;

  getStockMovements(page: number = 0, size: number = 10): Observable<StockMovementPage> {
    return this.http.get<StockMovementPage>(`${this.baseUrl}/stock/movements?page=${page}&size=${size}`);
  }
}
