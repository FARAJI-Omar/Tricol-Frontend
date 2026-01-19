import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { OrderService } from '../services/order.service';
import { SupplierService } from '../../suppliers/services/supplier.service';
import { Order } from '../../../core/models';
import { DashboardContentSection } from '../../../shared/components/dashboard-content-section/dashboard-content-section';
import { Table, TableColumn, TableAction } from '../../../shared/components/table/table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CreateOrderDialog } from '../dialogs/create-order-dialog/create-order-dialog';
import { OrderDetailsDialog } from '../dialogs/order-details-dialog/order-details-dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    DashboardContentSection,
    Table
  ],
  templateUrl: './orders.html',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private supplierService = inject(SupplierService);
  private dialog = inject(MatDialog);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  getStatusColors(status: string): { bgColor: string; textColor: string } {
    const colors: Record<string, { bgColor: string; textColor: string }> = {
      pending: { bgColor: '#FEF3C7', textColor: '#92400E' },
      validated: { bgColor: '#DBEAFE', textColor: '#1E40AF' },
      cancelled: { bgColor: '#FEE2E2', textColor: '#991B1B' },
      delivered: { bgColor: '#D1FAE5', textColor: '#065F46' }
    };
    return colors[status] || { bgColor: '#F3F4F6', textColor: '#374151' };
  }

  displayOrders = computed(() => {
    return this.orders().map(order => {
      const statusColors = this.getStatusColors(order.status);
      return {
        ...order,
        orderDate: new Date(order.orderDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        totalAmount: `${order.totalAmount.toFixed(2)} MAD`,
        statusBadge: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        statusColor: statusColors.bgColor,
        statusTextColor: statusColors.textColor,
        supplierDisplay: order.supplierName || `ID: ${order.supplierId}`
      };
    });
  });

  columns: TableColumn[] = [
    { key: 'id', label: 'Order ID', type: 'text' },
    { key: 'supplierDisplay', label: 'Supplier', type: 'text' },
    { key: 'orderDate', label: 'Order Date', type: 'text' },
    { key: 'statusBadge', label: 'Status', type: 'badge', colorField: 'statusColor' },
    { key: 'totalAmount', label: 'Total Amount', type: 'text' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  actions: TableAction[] = [
    {
      label: 'Details',
      callback: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        if (order) this.openDetailsDialog(order);
      },
      bgColor: '#10B981',
      textColor: '#FFFFFF'
    },
    {
      label: 'Validate',
      callback: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        if (order && order.status === 'pending') {
          this.validateOrder(order);
        }
      },
      bgColor: '#3B82F6',
      textColor: '#FFFFFF',
      condition: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        return order?.status === 'pending';
      }
    },
    {
      label: 'Deliver',
      callback: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        if (order && order.status === 'validated') {
          this.deliverOrder(order);
        }
      },
      bgColor: '#8B5CF6',
      textColor: '#FFFFFF',
      condition: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        return order?.status === 'validated';
      }
    },
    {
      label: 'Cancel',
      callback: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        if (order && order.status === 'pending') {
          this.cancelOrder(order);
        }
      },
      bgColor: '#EF4444',
      textColor: '#FFFFFF',
      condition: (row: any) => {
        const order = this.orders().find(o => o.id === row.id);
        return order?.status === 'pending';
      }
    }
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    
    forkJoin({
      orders: this.orderService.getOrders(),
      suppliers: this.supplierService.getSuppliers()
    }).subscribe({
      next: ({ orders, suppliers }) => {
        const ordersWithSupplierNames = orders.map(order => ({
          ...order,
          supplierName: suppliers.find(s => s.id === order.supplierId)?.society || undefined
        }));
        this.orders.set(ordersWithSupplierNames);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateOrderDialog, {
      disableClose: true,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  openDetailsDialog(order: Order): void {
    this.dialog.open(OrderDetailsDialog, {
      data: { order },
      width: '700px'
    });
  }

  validateOrder(order: Order): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Validate Order?',
        message: `Are you sure you want to validate order #${order.id}?`,
        confirmText: 'Validate',
        cancelText: 'Cancel',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.orderService.updateOrderStatus(order.id!, 'validated').subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error validating order:', error);
          }
        });
      }
    });
  }

  deliverOrder(order: Order): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Deliver Order?',
        message: `Are you sure you want to mark order #${order.id} as delivered? This will update the inventory.`,
        confirmText: 'Deliver',
        cancelText: 'Cancel',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.orderService.receiveOrder(order.id!).subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error delivering order:', error);
          }
        });
      }
    });
  }

  cancelOrder(order: Order): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Cancel Order?',
        message: `Are you sure you want to cancel order #${order.id}? This action cannot be undone.`,
        confirmText: 'Cancel Order',
        cancelText: 'Go Back',
        confirmColor: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.orderService.updateOrderStatus(order.id!, 'cancelled').subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error cancelling order:', error);
          }
        });
      }
    });
  }
}
