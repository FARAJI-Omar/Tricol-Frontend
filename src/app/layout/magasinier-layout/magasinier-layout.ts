import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { SidebarItem } from '../../shared/components/sidebar/sidebar-item';
import { UserDataService } from '../../core/services/user-data-service';

function getMagasinierSidebarMenu(): SidebarItem[] {
  const userDataService = inject(UserDataService);

  const logout = () => {
    userDataService.logout();
  };

  return [
    {
      label: 'Dashboard',
      route: '/magasinier',
      icon: 'dashboard',
      iconColor: '#f59e0b',
      activeBgColor: '#fde68a',
      activeTextColor: '#d97706'
    },
    {
      label: 'Products',
      route: '/magasinier/products',
      icon: 'inventory_2',
      iconColor: '#f59e0b',
      activeBgColor: '#fde68a',
      activeTextColor: '#d97706'
    },
    {
      label: 'Orders',
      route: '/magasinier/orders',
      icon: 'receipt_long',
      iconColor: '#f59e0b',
      activeBgColor: '#fde68a',
      activeTextColor: '#d97706'
    },
    {
      label: 'Stock Movements',
      route: '/magasinier/movements',
      icon: 'swap_horiz',
      iconColor: '#f59e0b',
      activeBgColor: '#fde68a',
      activeTextColor: '#d97706'
    },
    {
      label: 'Logout',
      route: '',
      icon: 'logout',
      separator: true,
      action: logout
    }
  ];
}

@Component({
  selector: 'app-magasinier-layout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './magasinier-layout.html',
})
export class MagasinierLayout {
  sidebarMenu = getMagasinierSidebarMenu();
}
