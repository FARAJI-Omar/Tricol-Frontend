import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-product-dialog.html',
})
export class EditProductDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<EditProductDialog>);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  data = inject<{ product: Product }>(MAT_DIALOG_DATA);

  productForm: FormGroup;
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    this.productForm = this.fb.group({
      reference: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      unitPrice: [0, [Validators.min(0)]],
      category: ['', [Validators.required]],
      measureUnit: ['', [Validators.required]],
      reorderPoint: [0, [Validators.min(0)]],
      currentStock: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data?.product) {
      this.productForm.patchValue(this.data.product);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.updateProduct(this.data.product.id!, this.productForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Product updated successfully!');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.message || 'Failed to update product';
        this.errorMessage.set(message);
      }
    });
  }
}
