import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-supplier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-supplier-dialog.html',
})
export class CreateSupplierDialog {
  private dialogRef = inject(MatDialogRef<CreateSupplierDialog>);
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);

  supplierForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    this.supplierForm = this.fb.group({
      society: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      socialReason: ['', [Validators.required]],
      contactAgent: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
      ice: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.supplierService.createSupplier(this.supplierForm.value).subscribe({
      next: (supplier) => {
        this.isLoading.set(false);
        this.dialogRef.close(supplier);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.message || 'Failed to create supplier';
        this.errorMessage.set(message);
      }
    });
  }
}
