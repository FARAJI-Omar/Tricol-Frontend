import { Component, inject, signal, computed } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { SupplierService } from '../../../suppliers/services/supplier.service';
import { ProductService } from '../../../products/services/product.service';
import { Supplier, Product } from '../../../../core/models';

@Component({
  selector: 'app-create-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-order-dialog.html',
})
export class CreateOrderDialog {
  private dialogRef = inject(MatDialogRef<CreateOrderDialog>);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private supplierService = inject(SupplierService);
  private productService = inject(ProductService);

  orderForm: FormGroup;
  suppliers = signal<Supplier[]>([]);
  products = signal<Product[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  totalAmount = computed(() => {
    let total = 0;
    const items = this.orderForm.get('items') as FormArray;
    items.controls.forEach(item => {
      const quantity = item.get('quantity')?.value || 0;
      const productId = item.get('productId')?.value;
      if (productId) {
        const product = this.products().find(p => p.id === Number(productId));
        if (product) {
          total += quantity * product.unitPrice;
        }
      }
    });
    return total;
  });

  constructor() {
    this.orderForm = this.fb.group({
      supplierId: ['', [Validators.required]],
      items: this.fb.array([])
    });

    this.loadSuppliers();
    this.loadProducts();
    this.addItem();
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers.set(suppliers);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  getProductPrice(productId: string): number {
    const product = this.products().find(p => p.id === Number(productId));
    return product?.unitPrice || 0;
  }

  getProductName(productId: string): string {
    const product = this.products().find(p => p.id === Number(productId));
    return product?.name || '';
  }

  getItemTotal(index: number): number {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const productId = item.get('productId')?.value;
    const price = this.getProductPrice(productId);
    return quantity * price;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formValue = this.orderForm.value;
    const request = {
      supplierId: Number(formValue.supplierId),
      items: formValue.items.map((item: any) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity)
      }))
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.orderService.createOrder(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Order created successfully!');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.message || 'Failed to create order';
        this.errorMessage.set(message);
      }
    });
  }
}
