import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../../core/models';

@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-status-dialog.html',
})
export class UpdateStatusDialog {
  private dialogRef = inject(MatDialogRef<UpdateStatusDialog>);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  data = inject(MAT_DIALOG_DATA);

  order: Order = this.data.order;
  statusForm: FormGroup;
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'validated', label: 'Validated' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delivered', label: 'Delivered' }
  ];

  constructor() {
    this.statusForm = this.fb.group({
      status: [this.order.status, [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const newStatus = this.statusForm.value.status;

    this.orderService.updateOrderStatus(this.order.id!, newStatus).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Order status updated successfully!');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.message || 'Failed to update order status';
        this.errorMessage.set(message);
      }
    });
  }
}
