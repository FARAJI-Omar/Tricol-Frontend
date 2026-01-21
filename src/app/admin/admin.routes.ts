import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [roleGuard(['ADMIN'])],
    children: [
      {
        path: '',
        loadComponent: () => import('../dashboard/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users/users').then(m => m.Users)
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./suppliers/suppliers/suppliers').then(m => m.Suppliers)
      },
      {
        path: 'products',
        loadComponent: () => import('./products').then(m => m.Products)
      },
      {
        path: 'goodsout',
        loadComponent: () => import('../shared/components/goods-out/goods-out').then(m => m.GoodsOutComponent)
      }
    ]
  }
];
