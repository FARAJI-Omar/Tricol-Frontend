import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Supplier } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private apiService = inject(ApiService<Supplier>);

  getSuppliers(): Observable<Supplier[]> {
    return this.apiService.getAll('/suppliers');
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.apiService.getById('/suppliers', id);
  }

  createSupplier(supplier: Omit<Supplier, 'id' | 'orders'>): Observable<Supplier> {
    return this.apiService.create('/suppliers/create', supplier as any);
  }

  updateSupplier(id: number, supplier: Partial<Omit<Supplier, 'id' | 'orders'>>): Observable<Supplier> {
    return this.apiService.update('/suppliers', id, supplier as any);
  }

  deleteSupplier(id: number): Observable<any> {
    return this.apiService.delete('/suppliers', id);
  }
}
