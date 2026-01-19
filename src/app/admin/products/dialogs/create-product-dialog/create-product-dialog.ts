import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-product-dialog.html',
})
export class CreateProductDialog {
  private dialogRef = inject(MatDialogRef<CreateProductDialog>);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  productForm: FormGroup;
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    this.productForm = this.fb.group({
      reference: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.maxLength(1000)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      measureUnit: ['', [Validators.required]],
      reorderPoint: [0, [Validators.required, Validators.min(0)]],
      currentStock: [0, [Validators.min(0)]]
    });
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

    this.productService.createProduct(this.productForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Product created successfully!');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.message || 'Failed to create product';
        this.errorMessage.set(message);
      }
    });
  }
}
