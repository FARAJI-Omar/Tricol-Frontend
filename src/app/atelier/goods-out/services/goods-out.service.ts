import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoodsOut } from '../../../core/models';
import { environment } from '../../../../env';

@Injectable({ providedIn: 'root' })
export class GoodsOutService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api_base_url}/goods-out`;

  getGoodsOut(): Observable<GoodsOut[]> {
    return this.http.get<GoodsOut[]>(this.baseUrl);
  }

  getGoodsOutById(id: number): Observable<GoodsOut> {
    return this.http.get<GoodsOut>(`${this.baseUrl}/${id}`);
  }

  createGoodsOut(goodsOut: Partial<GoodsOut>): Observable<GoodsOut> {
    return this.http.post<GoodsOut>(this.baseUrl, goodsOut);
  }

  validateGoodsOut(id: number): Observable<GoodsOut> {
    return this.http.put<GoodsOut>(`${this.baseUrl}/${id}/validate`, {});
  }

  cancelGoodsOut(id: number): Observable<GoodsOut> {
    return this.http.put<GoodsOut>(`${this.baseUrl}/${id}/cancel`, {});
  }

  deleteGoodsOut(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
