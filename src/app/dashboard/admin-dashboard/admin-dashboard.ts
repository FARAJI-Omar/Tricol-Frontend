import { Component, signal, computed, OnInit } from '@angular/core';
import { DashboardContentSection } from "../../shared/components/dashboard-content-section/dashboard-content-section";
import { UserDataService } from '../../core/services/user-data-service';
import { StatsCard } from "../../shared/components/stats-card/stats-card";
import { StatsCardItem } from '../../shared/components/stats-card/stats-card-item';
import { SupplierService } from '../../admin/suppliers/services/supplier.service';
import { ProductService } from '../../admin/products/services/product.service';
import { OrderService } from '../../admin/orders/services/order.service';
import { LowStockAlerts } from '../../shared/components/low-stock-alerts/low-stock-alerts';
import { Graph } from '../../shared/components/graph/graph';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardContentSection, StatsCard, Graph, LowStockAlerts],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
    // Signals for reactive state management
    private userData = signal<{ username: string } | null>(null);
    
    // Computed signals derived from state
    userName = computed(() => this.userData()?.username ?? null);
    
    // Stats cards
    statsCards = signal<StatsCardItem[]>([
        {
            label: 'Total Suppliers',
            value: 0,
            icon: 'local_shipping',
            iconColor: '#3b82f6',
            iconBgColor: '#dbeafe'
        },
        {
            label: 'Active Products',
            value: 0,
            icon: 'checkroom',
            iconColor: '#3b82f6',
            iconBgColor: '#dbeafe'
        },
        {
            label: 'Pending Orders',
            value: 0,
            icon: 'event_note',
            iconColor: '#f97316',
            iconBgColor: '#fed7aa'
        },
        {
            label: 'Stock Alerts',
            value: 0,
            icon: 'warning',
            iconColor: '#ef4444',
            iconBgColor: '#fecaca'
        }
    ]);

    constructor(
        private userDataService: UserDataService,
        private supplierService: SupplierService,
        private productService: ProductService,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        const data = this.userDataService.getUserData();
        this.userData.set(data);
        this.loadSuppliers();
        this.loadProducts();
        this.loadOrders();
    }

    private loadSuppliers() {
        this.supplierService.getSuppliersCount().subscribe(count => {
            this.updateStat(0, count);
        });
    }

    private loadProducts() {
        this.productService.getActiveProductsCount().subscribe(count => {
            this.updateStat(1, count);
        });
        this.productService.getStockAlertsCount().subscribe(count => {
            this.updateStat(3, count);
        });
    }

    private loadOrders() {
        this.orderService.getPendingOrdersCount().subscribe(count => {
            this.updateStat(2, count);
        });
    }

    private updateStat(index: number, value: number) {
        const stats = [...this.statsCards()];
        stats[index].value = value;
        this.statsCards.set(stats);
    }
}
