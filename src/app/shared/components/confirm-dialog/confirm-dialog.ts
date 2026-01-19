import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="min-w-96 p-2">
      <h2 mat-dialog-title class="m-0 text-2xl font-semibold text-gray-900">
        {{ data.title }}
      </h2>

      <div mat-dialog-content class="py-6">
        <p class="text-gray-700 text-base">{{ data.message }}</p>
      </div>

      <div mat-dialog-actions class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          (click)="onCancel()"
          class="px-6 py-2 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-gray-700 transition-colors"
        >
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          type="button"
          (click)="onConfirm()"
          [class]="getConfirmButtonClass()"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef<ConfirmDialog>);
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getConfirmButtonClass(): string {
    const baseClasses = 'px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors';
    const colorClass = this.data.confirmColor === 'danger' 
      ? 'bg-red-500 hover:bg-red-700' 
      : 'bg-blue-500 hover:bg-blue-700';
    return `${baseClasses} ${colorClass}`;
  }
}
