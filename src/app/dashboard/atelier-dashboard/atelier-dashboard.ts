import { Component, signal, computed, OnInit } from '@angular/core';
import { UserDataService } from '../../core/services/user-data-service';
import { DashboardContentSection } from '../../shared/components/dashboard-content-section/dashboard-content-section';
import { StatsCardItem } from '../../shared/components/stats-card/stats-card-item';
import { StatsCard } from "../../shared";

@Component({
  selector: 'app-atelier-dashboard',
  standalone: true,
  imports: [DashboardContentSection, StatsCard],
  templateUrl: './atelier-dashboard.html',
})
export class AtelierDashboard implements OnInit {
    // Signals for reactive state management
    private userData = signal<{ username: string } | null>(null);
    userName = computed(() => this.userData()?.username ?? null);

     statsCards = signal<StatsCardItem[]>([
            {
                label: 'Total Forms',
                value: 0,
                icon: 'output',
                iconColor: '#f59e0b',
                iconBgColor: '#fef3c7'
            },
            {
                label: 'Draft Forms',
                value: 0,
                icon: 'pending_actions',
                iconColor: '#3b82f6',
                iconBgColor: '#dbeafe'
            },
            {
                label: 'Validated Forms',
                value: 0,
                icon: 'checkbox_circle',
                iconColor: '#10b981',
                iconBgColor: '#d1fae5',
            },
            {
                label: 'Cancelled Forms',
                value: 0,
                icon: 'cancel',
                iconColor: '#ef4444',
                iconBgColor: '#fee2e2'
            }
        ]);

    constructor(private userDataService: UserDataService) {}

    ngOnInit() {
        const data = this.userDataService.getUserData();
        this.userData.set(data);
        this.statsCards;
    }

    private loadStats() {
        // this.productService.getProducts().subscribe(products => {
        //     const totalProducts = products.length;
        //     const inStockProducts = products.filter(p => p.currentStock > 0).length;
        //     this.updateStat(0, totalProducts);
        //     this.updateStat(3, inStockProducts);
        // });
        // this.productService.getStockAlertsCount().subscribe(count => {
        //     this.updateStat(1, count);
        // });
        // this.orderService.getOrders().subscribe(orders => {
        //     const ordersToReceive = orders.filter(o => o.status === 'validated').length;
        //     this.updateStat(2, ordersToReceive);
        // });
    }

    private updateStat(index: number, value: number | string) {
        const stats = [...this.statsCards()];
        stats[index].value = value;
        this.statsCards.set(stats);
    }
}
