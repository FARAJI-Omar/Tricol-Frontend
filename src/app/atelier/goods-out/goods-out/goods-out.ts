import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GoodsOutService } from '../services/goods-out.service';
import { GoodsOut } from '../../../core/models';
import { DashboardContentSection } from '../../../shared/components/dashboard-content-section/dashboard-content-section';
import { Table, TableColumn, TableAction } from '../../../shared/components/table/table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CreateGoodsOutDialog } from '../dialogs/create-goods-out-dialog/create-goods-out-dialog';
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
        return row.status === 'DRAFT' && this.userDataService.hasPermission('SORTIE_VALIDATE');
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
        return row.status === 'DRAFT' && this.userDataService.hasPermission('SORTIE_CANCEL');
      }
    },
    {
      label: 'Delete',
      icon: 'delete',
      bgColor: 'transparent',
      textColor: '#9CA3AF',
      callback: (row: any) => {
        const goodsOut = this.goodsOutList().find(g => g.id === row.id);
        if (goodsOut) this.deleteGoodsOut(goodsOut);
      },
      condition: (row: any) => {
        return row.status === 'DRAFT' && this.userDataService.hasPermission('SORTIE_DELETE');
      }
    }
  ];

  canCreateGoodsOut = computed(() => this.userDataService.hasPermission('SORTIE_CREATE'));

  ngOnInit(): void {
    this.loadGoodsOut();
  }

  loadGoodsOut(): void {
    this.isLoading.set(true);
    this.goodsOutService.getGoodsOut().subscribe({
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
        this.goodsOutService.validateGoodsOut(goodsOut.id).subscribe({
          next: () => {
            this.loadGoodsOut();
          },
          error: (error) => {
            console.error('Error validating goods-out:', error);
          }
        });
      }
    });
  }

  cancelGoodsOut(goodsOut: GoodsOut): void {
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
        this.goodsOutService.cancelGoodsOut(goodsOut.id).subscribe({
          next: () => {
            this.loadGoodsOut();
          },
          error: (error) => {
            console.error('Error cancelling goods-out:', error);
          }
        });
      }
    });
  }

  deleteGoodsOut(goodsOut: GoodsOut): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Goods-Out Form?',
        message: `Are you sure you want to delete "${goodsOut.slipNumber}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && goodsOut.id) {
        this.goodsOutService.deleteGoodsOut(goodsOut.id).subscribe({
          next: () => {
            this.loadGoodsOut();
          },
          error: (error) => {
            console.error('Error deleting goods-out:', error);
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
