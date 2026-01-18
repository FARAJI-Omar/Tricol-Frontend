import { Component, signal, computed, OnInit } from '@angular/core';
import { UserDataService } from '../../core/services/user-data-service';

@Component({
  selector: 'app-magasinier-dashboard',
  imports: [],
  templateUrl: './magasinier-dashboard.html',
})
export class MagasinierDashboard implements OnInit {
    // Signals for reactive state management
    private userData = signal<{ username: string } | null>(null);
    userName = computed(() => this.userData()?.username ?? null);

    constructor(private userDataService: UserDataService) {}

    ngOnInit() {
        const data = this.userDataService.getUserData();
        this.userData.set(data);
    }
}
