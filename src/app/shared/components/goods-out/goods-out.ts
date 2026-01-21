import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GoodsOutService } from '../../../core/services/goods-out.service';
import { GoodsOut } from '../../../core/models';
import { DashboardContentSection } from '../dashboard-content-section/dashboard-content-section';
import { Table, TableColumn, TableAction } from '../table/table';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { CreateGoodsOutDialog } from '../create-goods-out-dialog/create-goods-out-dialog';
import { UserDataService } from '../../../core/services/user-data-service';

@Component({
  selector: 'app-goods-out',
  standalone: true,
  imports: [
    CommonModule,
    DashboardContentSection,
    Table
  ],
  templateUrl: './goods-out.html',
})
export class GoodsOutComponent implements OnInit {
  private goodsOutService = inject(GoodsOutService);
  private dialog = inject(MatDialog);
  private userDataService = inject(UserDataService);

  goodsOutList = signal<GoodsOut[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Gate entire component visibility with BON_SORTIE_READ permission
  canReadGoodsOut = computed(() => this.userDataService.hasPermission('BON_SORTIE_READ'));

  displayGoodsOut = computed(() => {
    return this.goodsOutList().map(goodsOut => {
      const statusColors = this.getStatusColors(goodsOut.status);
      return {
        ...goodsOut,
        exitDate: new Date(goodsOut.exitDate).toLocaleDateString(),
        statusBadge: goodsOut.status,
        statusColor: statusColors.bgColor,
        statusTextColor: statusColors.textColor,
        reasonText: this.getReasonText(goodsOut.reason),
        itemCount: goodsOut.items.length
      };
    });
  });

  columns: TableColumn[] = [
    { key: 'slipNumber', label: 'Slip Number', type: 'text' },
    { key: 'exitDate', label: 'Exit Date', type: 'text' },
    { key: 'destinationWorkshop', label: 'Destination', type: 'text' },
    { key: 'reasonText', label: 'Reason', type: 'text' },
    { key: 'itemCount', label: 'Items', type: 'text' },
    { key: 'statusBadge', label: 'Status', type: 'badge', colorField: 'statusColor' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  actions: TableAction[] = [
    {
      label: 'Validate',
      icon: 'check_circle',
      bgColor: 'transparent',
      textColor: '#10B981',
      callback: (row: any) => {
        const goodsOut = this.goodsOutList().find(g => g.id === row.id);
        if (goodsOut) this.validateGoodsOut(goodsOut);
      },
      condition: (row: any) => {
        return row.status === 'DRAFT' && this.userDataService.hasPermission('BON_SORTIE_VALIDATE');
      }
    },
    {
      label: 'Cancel',
      icon: 'cancel',
      bgColor: 'transparent',
      textColor: '#EF4444',
      callback: (row: any) => {
        const goodsOut = this.goodsOutList().find(g => g.id === row.id);
        if (goodsOut) this.cancelGoodsOut(goodsOut);
      },
      condition: (row: any) => {
        return row.status === 'DRAFT' && this.userDataService.hasPermission('BON_SORTIE_CANCEL');
      }
    }
  ];

  canCreateGoodsOut = computed(() => this.userDataService.hasPermission('BON_SORTIE_CREATE'));

  ngOnInit(): void {
    // Check permission before loading
    if (!this.canReadGoodsOut()) {
      this.isLoading.set(false);
      return;
    }
    this.loadGoodsOut();
  }

  loadGoodsOut(): void {
    this.isLoading.set(true);
    this.goodsOutService.getAll().subscribe({
      next: (goodsOutList) => {
        this.goodsOutList.set(goodsOutList);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading goods-out:', error);
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateGoodsOutDialog, {
      disableClose: true,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGoodsOut();
      }
    });
  }

  validateGoodsOut(goodsOut: GoodsOut): void {
    // Business logic check: only allow validate on DRAFT status
    if (goodsOut.status !== 'DRAFT') {
      this.errorMessage.set('Can only validate DRAFT goods-out forms.');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Validate Goods-Out Form?',
        message: `Are you sure you want to validate "${goodsOut.slipNumber}"? This action cannot be undone.`,
        confirmText: 'Validate',
        cancelText: 'Cancel',
        confirmColor: 'success'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && goodsOut.id) {
        this.errorMessage.set(null);
        this.goodsOutService.validate(goodsOut.id).subscribe({
          next: () => {
            this.successMessage.set(`Goods-out form "${goodsOut.slipNumber}" validated successfully!`);
            setTimeout(() => this.successMessage.set(null), 5000);
            this.loadGoodsOut();
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'Failed to validate goods-out form. Please try again.');
            setTimeout(() => this.errorMessage.set(null), 5000);
          }
        });
      }
    });
  }

  cancelGoodsOut(goodsOut: GoodsOut): void {
    // Business logic check: only allow cancel on DRAFT status
    if (goodsOut.status !== 'DRAFT') {
      this.errorMessage.set('Can only cancel DRAFT goods-out forms.');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Cancel Goods-Out Form?',
        message: `Are you sure you want to cancel "${goodsOut.slipNumber}"?`,
        confirmText: 'Cancel Form',
        cancelText: 'Back',
        confirmColor: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && goodsOut.id) {
        this.errorMessage.set(null);
        this.goodsOutService.cancel(goodsOut.id).subscribe({
          next: () => {
            this.successMessage.set(`Goods-out form "${goodsOut.slipNumber}" cancelled successfully!`);
            setTimeout(() => this.successMessage.set(null), 5000);
            this.loadGoodsOut();
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'Failed to cancel goods-out form. Please try again.');
            setTimeout(() => this.errorMessage.set(null), 5000);
          }
        });
      }
    });
  }

  private getStatusColors(status: string): { bgColor: string; textColor: string } {
    const statusMap: { [key: string]: { bgColor: string; textColor: string } } = {
      'DRAFT': { bgColor: '#FEF3C7', textColor: '#F59E0B' },
      'VALIDATED': { bgColor: '#D1FAE5', textColor: '#10B981' },
      'CANCELLED': { bgColor: '#FEE2E2', textColor: '#EF4444' }
    };
    return statusMap[status] || { bgColor: '#E5E7EB', textColor: '#6B7280' };
  }

  private getReasonText(reason: string): string {
    const reasonMap: { [key: string]: string } = {
      'PRODUCTION': 'Production',
      'MAINTENANCE': 'Maintenance',
      'OTHER': 'Other'
    };
    return reasonMap[reason] || reason;
  }
}
