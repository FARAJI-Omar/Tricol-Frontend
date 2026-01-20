import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { SidebarItem } from '../../shared/components/sidebar/sidebar-item';
import { UserDataService } from '../../core/services/user-data-service';

function getAchatsSidebarMenu(): SidebarItem[] {
  const userDataService = inject(UserDataService);

  const logout = () => {
    userDataService.logout();
  };

  return [
    {
      label: 'Dashboard',
      route: '/responsableachats',
      icon: 'dashboard',
      iconColor: '#5dd55d',
      activeBgColor: '#adebad',
      activeTextColor: '#29a329'
    },
    {
      label: 'Orders',
      route: '/responsableachats/orders',
      icon: 'receipt_long',
      iconColor: '#5dd55d',
      activeBgColor: '#adebad',
      activeTextColor: '#29a329'
    },
    {
      label: 'Suppliers',
      route: '/responsableachats/suppliers',
      icon: 'local_shipping',
      iconColor: '#5dd55d',
      activeBgColor: '#adebad',
      activeTextColor: '#29a329'
    },
    {
      label: 'Products',
      route: '/responsableachats/products',
      icon: 'inventory_2',
      iconColor: '#5dd55d',
      activeBgColor: '#adebad',
      activeTextColor: '#29a329'
    },
    {
      label: 'Stock Movements',
      route: '/responsableachats/movements',
      icon: 'swap_horiz',
      iconColor: '#5dd55d',
      activeBgColor: '#adebad',
      activeTextColor: '#29a329'
    },
    {
      label: 'Logout',
      icon: 'logout',
      separator: true,
      action: logout,
    }
  ];
}

@Component({
  selector: 'app-achats-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './achats-layout.html',
})
export class AchatsLayout {
  sidebarMenu: SidebarItem[] = getAchatsSidebarMenu();
}
