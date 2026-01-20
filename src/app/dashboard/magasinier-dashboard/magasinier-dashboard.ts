import { Component, signal, computed, OnInit } from '@angular/core';
import { UserDataService } from '../../core/services/user-data-service';
import { DashboardContentSection } from '../../shared/components/dashboard-content-section/dashboard-content-section';
import { StatsCard } from '../../shared/components/stats-card/stats-card';
import { StatsCardItem } from '../../shared/components/stats-card/stats-card-item';
import { ProductService } from '../../admin/products/services/product.service';
import { OrderService } from '../../admin/orders/services/order.service';
import { LowStockAlerts } from '../../shared/components/low-stock-alerts/low-stock-alerts';

@Component({
  selector: 'app-magasinier-dashboard',
  imports: [DashboardContentSection, StatsCard, LowStockAlerts],
  templateUrl: './magasinier-dashboard.html',
})
export class MagasinierDashboard implements OnInit {
    private userData = signal<{ username: string } | null>(null);
    userName = computed(() => this.userData()?.username ?? null);

    statsCards = signal<StatsCardItem[]>([
        {
            label: 'Total Products',
            value: 0,
            icon: 'inventory_2',
            iconColor: '#f59e0b',
            iconBgColor: '#fef3c7'
        },
        {
            label: 'Low Stock Alerts',
            value: 0,
            icon: 'warning',
            iconColor: '#ef4444',
            iconBgColor: '#fee2e2'
        },
        {
            label: 'Orders to Receive',
            value: 0,
            icon: 'inventory',
            iconColor: '#3b82f6',
            iconBgColor: '#dbeafe'
        },
        {
            label: 'In Stock Products',
            value: 0,
            icon: 'check_circle',
            iconColor: '#10b981',
            iconBgColor: '#d1fae5'
        }
    ]);

    constructor(
        private userDataService: UserDataService,
        private productService: ProductService,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        const data = this.userDataService.getUserData();
        this.userData.set(data);
        this.loadStats();
    }

    private loadStats() {
        this.productService.getProducts().subscribe(products => {
            const totalProducts = products.length;
            const inStockProducts = products.filter(p => p.currentStock > 0).length;
            this.updateStat(0, totalProducts);
            this.updateStat(3, inStockProducts);
        });

        this.productService.getStockAlertsCount().subscribe(count => {
            this.updateStat(1, count);
        });

        this.orderService.getOrders().subscribe(orders => {
            const ordersToReceive = orders.filter(o => o.status === 'validated').length;
            this.updateStat(2, ordersToReceive);
        });
    }

    private updateStat(index: number, value: number | string) {
        const stats = [...this.statsCards()];
        stats[index].value = value;
        this.statsCards.set(stats);
    }
}
