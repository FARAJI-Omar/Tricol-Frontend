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
      label: 'Orders',
      route: '/commandes',
      icon: 'receipt_long'
    },
    {
      label: 'Products',
      route: '/produits',
      icon: 'checkroom'
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
