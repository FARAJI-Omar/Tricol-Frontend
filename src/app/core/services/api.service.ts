import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env';

@Injectable({ providedIn: 'root' })
export class ApiService<T> {
  private baseUrl = environment.api_base_url;

  constructor(private http: HttpClient) {}

  getAll(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}${endpoint}`);
  }

  getById(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}/${id}`);
  }

  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  update(endpoint: string, id: number | string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}/${id}`, { responseType: 'text' });
  }
}
