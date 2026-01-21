import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { SidebarItem } from '../../shared/components/sidebar/sidebar-item';
import { UserDataService } from '../../core/services/user-data-service';

function getAtelierSidebarMenu(): SidebarItem[] {
  const userDataService = inject(UserDataService);

  const logout = () => {
    userDataService.logout();
  };

  return [
    {
      label: 'Dashboard',
      route: '/chefatelier',
      icon: 'dashboard',
      iconColor: '#8b5cf6',
      activeBgColor: '#ddd6fe',
      activeTextColor: '#7c3aed'
    },
    {
      label: 'Products',
      route: '/chefatelier/products',
      icon: 'inventory_2',
      iconColor: '#8b5cf6',
      activeBgColor: '#ddd6fe',
      activeTextColor: '#7c3aed'
    },
    {
      label: 'Goods-Out',
      route: '/chefatelier/goodsout',
      icon: 'output',
      iconColor: '#8b5cf6',
      activeBgColor: '#ddd6fe',
      activeTextColor: '#7c3aed'
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
  selector: 'app-atelier-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './atelier-layout.html',
})
export class AtelierLayout {
  sidebarMenu: SidebarItem[] = getAtelierSidebarMenu();
}
