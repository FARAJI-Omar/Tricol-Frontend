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
import { UserDataService } from '../../../core/services/user-data-service';

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
  private userDataService = inject(UserDataService);

  products = signal<Product[]>([]);
  isLoading = signal(true);

  displayProducts = computed(() => {
    return this.products().map(product => {
      let stockStatus = 'normal';
      if (product.currentStock === 0) {
        stockStatus = 'out';
      } else if (product.currentStock < product.reorderPoint) {
        stockStatus = 'low';
      }
      
      return {
        ...product,
        unitPrice: `${product.unitPrice.toFixed(2)} DH`,
        stockValue: product.currentStock,
        stockStatus: stockStatus
      };
    });
  });

  columns: TableColumn[] = [
    { key: 'reference', label: 'Reference', type: 'text' },
    { key: 'name', label: 'Name', type: 'product-name' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'unitPrice', label: 'Unit Price', type: 'text' },
    { key: 'measureUnit', label: 'Unit', type: 'text' },
    { key: 'currentStock', label: 'Stock', type: 'stock' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      bgColor: 'transparent',
      textColor: '#9CA3AF',
      callback: (row: any) => {
        const product = this.products().find(p => p.id === row.id);
        if (product) this.openEditDialog(product);
      },
      condition: (row: any) => {
        return this.userDataService.hasPermission('PRODUIT_UPDATE');
      }
    },
    {
      label: 'Delete',
      icon: 'delete',
      bgColor: 'transparent',
      textColor: '#9CA3AF',
      callback: (row: any) => {
        const product = this.products().find(p => p.id === row.id);
        if (product) this.deleteProduct(product);
      },
      condition: (row: any) => {
        return this.userDataService.hasPermission('PRODUIT_DELETE');
      }
    }
  ];

  canCreateProduct = computed(() => this.userDataService.hasPermission('PRODUIT_CREATE'));

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
