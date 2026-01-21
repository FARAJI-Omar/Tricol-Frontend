import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { Login, Register } from './auth';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },

    {
        path: '',
        loadComponent: () => import('./layout/app-layout/app-layout').then(m => m.AppLayout),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/home/home').then(m => m.Home)
          },
          {
            path: 'admin',
            loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),
            canActivate: [roleGuard(['ADMIN'])],
            children: [
              {
                path: '',
                loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
              },
              {
                path: 'users',
                loadComponent: () => import('./admin/users/users/users').then(m => m.Users)
              },
              {
                path: 'suppliers',
                loadComponent: () => import('./admin/suppliers/suppliers/suppliers').then(m => m.Suppliers)
              },
              {
                path: 'products',
                loadComponent: () => import('./admin/products').then(m => m.Products)
              },
              {
                path: 'orders',
                loadComponent: () => import('./admin/orders').then(m => m.Orders)
              },
              {
                path: 'movements',
                loadComponent: () => import('./shared/components/stock-movements/stock-movements').then(m => m.StockMovements)
              },
              {
                path: 'goodsout',
                loadComponent: () => import('./shared/components/goods-out/goods-out').then(m => m.GoodsOutComponent)
              }
            ]
          },
          {
            path: 'users',
            redirectTo: 'admin/users'
          },
          {
            path: 'responsableachats',
            loadComponent: () => import('./layout/achats-layout/achats-layout').then(m => m.AchatsLayout),
            canActivate: [roleGuard(['RESPONSABLE_ACHATS'])],
            children: [
              {
                path: '',
                loadComponent: () => import('./dashboard/achats-dashboard/achats-dashboard').then(m => m.AchatsDashboard)
              },
              {
                path: 'orders',
                loadComponent: () => import('./admin/orders').then(m => m.Orders)
              },
              {
                path: 'suppliers',
                loadComponent: () => import('./admin/suppliers/suppliers/suppliers').then(m => m.Suppliers)
              },
              {
                path: 'products',
                loadComponent: () => import('./admin/products').then(m => m.Products)
              },
              {
                path: 'movements',
                loadComponent: () => import('./shared/components/stock-movements/stock-movements').then(m => m.StockMovements)
              }
            ]
          },
          {
            path: 'magasinier',
            loadComponent: () => import('./layout/magasinier-layout/magasinier-layout').then(m => m.MagasinierLayout),
            canActivate: [roleGuard(['MAGASINIER'])],
            children: [
              {
                path: '',
                loadComponent: () => import('./dashboard/magasinier-dashboard/magasinier-dashboard').then(m => m.MagasinierDashboard)
              },
              {
                path: 'products',
                loadComponent: () => import('./admin/products').then(m => m.Products)
              },
              {
                path: 'orders',
                loadComponent: () => import('./admin/orders').then(m => m.Orders)
              },
              {
                path: 'movements',
                loadComponent: () => import('./shared/components/stock-movements/stock-movements').then(m => m.StockMovements)
              }
            ]
          },
          {
            path: 'chefatelier',
            loadComponent: () => import('./layout/atelier-layout/atelier-layout').then(m => m.AtelierLayout),
            canActivate: [roleGuard(['CHEF_ATELIER'])],
            children: [
              {
                path: '',
                loadComponent: () => import('./dashboard/atelier-dashboard/atelier-dashboard').then(m => m.AtelierDashboard)
              },
              {
                path: 'products',
                loadComponent: () => import('./admin/products').then(m => m.Products)
              },
              {
                path: 'goodsout',
                loadComponent: () => import('./shared/components/goods-out/goods-out').then(m => m.GoodsOutComponent)
              }
            ]
          }
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
