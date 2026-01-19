import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-supplier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-supplier-dialog.html',
})
export class EditSupplierDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<EditSupplierDialog>);
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  data = inject<{ supplier: Supplier }>(MAT_DIALOG_DATA);

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
      ice: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]]
    });
  }

  ngOnInit(): void {
    if (this.data.supplier) {
      this.supplierForm.patchValue({
        society: this.data.supplier.society,
        address: this.data.supplier.address,
        socialReason: this.data.supplier.socialReason,
        contactAgent: this.data.supplier.contactAgent,
        email: this.data.supplier.email,
        phone: this.data.supplier.phone,
        city: this.data.supplier.city,
        ice: this.data.supplier.ice
      });
    }
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

    this.supplierService.updateSupplier(this.data.supplier.id, this.supplierForm.value).subscribe({
      next: (supplier) => {
        this.isLoading.set(false);
        this.dialogRef.close(supplier);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.message || 'Failed to update supplier';
        this.errorMessage.set(message);
      }
    });
  }
}
