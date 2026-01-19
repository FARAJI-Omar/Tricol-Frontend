import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../core/models';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details-dialog.html',
})
export class OrderDetailsDialog {
  private dialogRef = inject(MatDialogRef<OrderDetailsDialog>);
  data = inject(MAT_DIALOG_DATA);

  order: Order = this.data.order;

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      validated: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
