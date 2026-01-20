import { SidebarItem } from './sidebar-item';
import { UserDataService } from '../../../core/services/user-data-service';
import { inject } from '@angular/core';

export function getAdminSidebarMenu(): SidebarItem[] {
  const userDataService = inject(UserDataService);
  
  return [
    {
      label: 'Dashboard',
      route: '/admin',
      icon: 'dashboard'
    },
    {
      label: 'Suppliers',
      route: '/admin/suppliers',
      icon: 'local_shipping'
    },
    {
      label: 'Products',
      route: '/admin/products',
      icon: 'inventory_2'
    },
    {
      label: 'Orders',
      route: '/admin/orders',
      icon: 'receipt_long'
    },
    {
      label: 'Stock Movements',
      route: '/admin/movements',
      icon: 'swap_horiz'
    },
    {
      label: 'Users',
      route: '/admin/users',
      icon: 'people'
    },
    {
      label: 'Logout',
      route: '',
      icon: 'logout',
      separator: true,
      action: () => {
        userDataService.logout();
      }
    }
  ];
}
