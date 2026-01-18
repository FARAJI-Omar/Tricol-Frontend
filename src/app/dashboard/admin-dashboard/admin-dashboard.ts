import { Component, signal, computed, OnInit } from '@angular/core';
import { DashboardContentSection } from "../../shared/components/dashboard-content-section/dashboard-content-section";
import { UserDataService } from '../../core/services/user-data-service';
import { StatsCard } from "../../shared/components/stats-card/stats-card";
import { StatsCardItem } from '../../shared/components/stats-card/stats-card-item';
import { ADMIN_DASHBOARD_STATS } from '../../shared/components/stats-card/admin-dashboard-stats';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardContentSection, StatsCard],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
    // Signals for reactive state management
    private userData = signal<{ username: string } | null>(null);
    
    // Computed signals derived from state
    userName = computed(() => this.userData()?.username ?? null);
    
    // Stats cards (could be signal if dynamic)
    statsCards = signal<StatsCardItem[]>(ADMIN_DASHBOARD_STATS);

    constructor(private userDataService: UserDataService) {}

    ngOnInit() {
        const data = this.userDataService.getUserData();
        this.userData.set(data);
    }
}
