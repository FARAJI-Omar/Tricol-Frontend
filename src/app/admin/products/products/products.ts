import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { Product } from '../../../core/models';
import { DashboardContentSection } from '../../../shared/components/dashboard-content-section/dashboard-content-section';
import { Table, TableColumn, TableAction } from '../../../shared/components/table/table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CreateProductDialog } from '../dialogs/create-product-dialog/create-product-dialog';
import { EditProductDialog } from '../dialogs/edit-product-dialog/edit-product-dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    DashboardContentSection,
    Table
  ],
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);

  products = signal<Product[]>([]);
  isLoading = signal(true);

  displayProducts = computed(() => {
    return this.products().map(product => ({
      ...product,
      unitPrice: `${product.unitPrice.toFixed(2)} MAD`,
      currentStock: product.currentStock < product.reorderPoint 
        ? `${product.currentStock} ⚠️ Low` 
        : `${product.currentStock}`
    }));
  });

  columns: TableColumn[] = [
    { key: 'reference', label: 'Reference', type: 'text' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'unitPrice', label: 'Unit Price', type: 'text' },
    { key: 'measureUnit', label: 'Unit', type: 'text' },
    { key: 'currentStock', label: 'Stock', type: 'text' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      callback: (row: any) => {
        const product = this.products().find(p => p.id === row.id);
        if (product) this.openEditDialog(product);
      },
      bgColor: '#3B82F6',
      textColor: '#FFFFFF'
    },
    {
      label: 'Delete',
      callback: (row: any) => {
        const product = this.products().find(p => p.id === row.id);
        if (product) this.deleteProduct(product);
      },
      bgColor: '#EF4444',
      textColor: '#FFFFFF'
    }
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateProductDialog, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(EditProductDialog, {
      disableClose: true,
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Product?',
        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productService.deleteProduct(product.id!).subscribe({
          next: () => {
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
          }
        });
      }
    });
  }
}
