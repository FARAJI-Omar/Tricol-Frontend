import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { GoodsOutService } from '../../../core/services/goods-out.service';
import { ProductService } from '../../../admin/products/services/product.service';
import { Product, CreateGoodsOutRequest, GoodsOutItemRequest } from '../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-goods-out-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-goods-out-dialog.html',
})
export class CreateGoodsOutDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<CreateGoodsOutDialog>);
  private fb = inject(FormBuilder);
  private goodsOutService = inject(GoodsOutService);
  private productService = inject(ProductService);

  goodsOutForm: FormGroup;
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);
  products = signal<Product[]>([]);

  constructor() {
    this.goodsOutForm = this.fb.group({
      exitDate: ['', [Validators.required]],
      destinationWorkshop: ['', [Validators.required]],
      reason: ['PRODUCTION', [Validators.required]],
      comment: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.addItem(); // Add one item by default
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

  get items(): FormArray {
    return this.goodsOutForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      note: ['']
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.goodsOutForm.invalid) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.goodsOutForm.value;
    const request: CreateGoodsOutRequest = {
      exitDate: formValue.exitDate,
      destinationWorkshop: formValue.destinationWorkshop,
      reason: formValue.reason,
      comment: formValue.comment,
      items: formValue.items.map((item: any): GoodsOutItemRequest => ({
        productId: parseInt(item.productId),
        quantity: parseFloat(item.quantity),
        note: item.note
      }))
    };

    this.goodsOutService.create(request).subscribe({
      next: () => {
        this.successMessage.set('Goods-out form created successfully!');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to create goods-out form. Please try again.');
      }
    });
  }

  getProductName(productId: number): string {
    const product = this.products().find(p => p.id === productId);
    return product ? product.name : '';
  }
}
