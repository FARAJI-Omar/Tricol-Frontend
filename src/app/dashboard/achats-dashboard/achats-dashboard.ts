import { Component, signal, computed, OnInit } from '@angular/core';
import { UserDataService } from '../../core/services/user-data-service';
import { DashboardContentSection } from '../../shared/components/dashboard-content-section/dashboard-content-section';
import { StatsCard } from '../../shared/components/stats-card/stats-card';
import { StatsCardItem } from '../../shared/components/stats-card/stats-card-item';
import { SupplierService } from '../../admin/suppliers/services/supplier.service';
import { OrderService } from '../../admin/orders/services/order.service';
import { Graph } from '../../shared/components/graph/graph';

@Component({
  selector: 'app-achats-dashboard',
  standalone: true,
  imports: [DashboardContentSection, StatsCard, Graph],
  templateUrl: './achats-dashboard.html',
})
export class AchatsDashboard implements OnInit {
    private userData = signal<{ username: string } | null>(null);
    
    userName = computed(() => this.userData()?.username ?? null);
    
    statsCards = signal<StatsCardItem[]>([
        {
            label: 'Total Orders',
            value: 0,
            icon: 'receipt_long',
            iconColor: '#3b82f6',
            iconBgColor: '#dbeafe'
        },
        {
            label: 'Pending Orders',
            value: 0,
            icon: 'pending_actions',
            iconColor: '#f97316',
            iconBgColor: '#fed7aa'
        },
        {
            label: 'Active Suppliers',
            value: 0,
            icon: 'local_shipping',
            iconColor: '#10b981',
            iconBgColor: '#d1fae5'
        },
        {
            label: 'This Month Spending',
            value: '0 DH',
            icon: 'payments',
            iconColor: '#8b5cf6',
            iconBgColor: '#ede9fe'
        }
    ]);

    constructor(
        private userDataService: UserDataService,
        private supplierService: SupplierService,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        const data = this.userDataService.getUserData();
        this.userData.set(data);
        this.loadStats();
    }

    private loadStats() {
        this.orderService.getOrders().subscribe(orders => {
            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === 'pending').length;
            
            // Calculate this month spending
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            const thisMonthSpending = orders
                .filter(order => {
                    const orderDate = new Date(order.orderDate);
                    return orderDate.getMonth() === currentMonth && 
                           orderDate.getFullYear() === currentYear;
                })
                .reduce((sum, order) => sum + order.totalAmount, 0);
            
            this.updateStat(0, totalOrders);
            this.updateStat(1, pendingOrders);
            this.updateStat(3, `${thisMonthSpending.toLocaleString('fr-MA')} DH`);
        });

        this.supplierService.getSuppliersCount().subscribe(count => {
            this.updateStat(2, count);
        });
    }

    private updateStat(index: number, value: number | string) {
        const stats = [...this.statsCards()];
        stats[index].value = value;
        this.statsCards.set(stats);
    }
}
