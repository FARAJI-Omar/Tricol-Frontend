import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoodsOut, CreateGoodsOutRequest } from '../models';
import { ApiService } from './api.service';
import { environment } from '../../../env';

@Injectable({ providedIn: 'root' })

export class GoodsOutService {
  private apiService = inject(ApiService<GoodsOut>);
  private http = inject(HttpClient);
  private endpoint = '/exit-slips';
  private baseUrl = `${environment.api_base_url}${this.endpoint}`;

  // Use ApiService for standard CRUD operations
  getAll(): Observable<GoodsOut[]> {
    return this.apiService.getAll(this.endpoint);
  }

  getById(id: number): Observable<GoodsOut> {
    return this.apiService.getById(this.endpoint, id);
  }

  create(request: CreateGoodsOutRequest): Observable<GoodsOut> {
    return this.http.post<GoodsOut>(this.baseUrl, request);
  }

  // Custom operations not supported by generic ApiService
  validate(id: number): Observable<GoodsOut> {
    return this.http.post<GoodsOut>(`${this.baseUrl}/${id}/validate`, {});
  }

  cancel(id: number): Observable<GoodsOut> {
    return this.http.post<GoodsOut>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
