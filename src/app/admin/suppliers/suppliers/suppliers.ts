import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardContentSection } from '../../../shared/components/dashboard-content-section/dashboard-content-section';
import { Table, TableColumn, TableAction } from '../../../shared/components/table/table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../../../core/models';
import { CreateSupplierDialog } from '../dialogs/create-supplier-dialog/create-supplier-dialog';
import { EditSupplierDialog } from '../dialogs/edit-supplier-dialog/edit-supplier-dialog';

interface SupplierWithOrderCount extends Supplier {
  orderCount: number;
}

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    DashboardContentSection,
    Table,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './suppliers.html',
})
export class Suppliers implements OnInit {
  private supplierService = inject(SupplierService);
  private dialog = inject(MatDialog);

  suppliers = signal<SupplierWithOrderCount[]>([]);
  isLoading = signal(false);

  supplierCount = computed(() => this.suppliers().length);

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'society', label: 'Society', type: 'text' },
    { key: 'contactAgent', label: 'Contact Agent', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'orderCount', label: 'Orders', type: 'text' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      callback: (row) => this.openEditDialog(row as SupplierWithOrderCount),
      bgColor: '#3B82F6',
      textColor: '#FFFFFF',
      hoverBgColor: '#2563EB'
    },
    {
      label: 'Delete',
      callback: (row) => this.confirmDelete(row as SupplierWithOrderCount),
      bgColor: '#EF4444',
      textColor: '#FFFFFF'
    }
  ];

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading.set(true);
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        const suppliersWithCount = suppliers.map((supplier, index) => ({
          ...supplier,
          id: (supplier as any).id,
          orderCount: supplier.orders?.length ?? 0
        }));
        console.log('Suppliers with count:', suppliersWithCount);
        this.suppliers.set(suppliersWithCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateSupplierDialog, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  openEditDialog(supplier: SupplierWithOrderCount): void {
    const dialogRef = this.dialog.open(EditSupplierDialog, {
      disableClose: true,
      data: { supplier }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  confirmDelete(supplier: SupplierWithOrderCount): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Supplier',
        message: `Are you sure you want to delete "${supplier.society}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteSupplier(supplier.id);
      }
    });
  }

  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers.update(items => items.filter(s => s.id !== id));
      },
      error: (err) => {
        console.error('Error deleting supplier:', err);
        alert('Failed to delete supplier. Please try again.');
      }
    });
  }
}
