import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [roleGuard(['ADMIN'])]
  },
  {
    path: 'responsableachats',
    loadComponent: () => import('./achats-dashboard/achats-dashboard').then(m => m.AchatsDashboard),
    canActivate: [roleGuard(['RESPONSABLE_ACHATS'])]
  },
  {
    path: 'magasinier',
    loadComponent: () => import('./magasinier-dashboard/magasinier-dashboard').then(m => m.MagasinierDashboard),
    canActivate: [roleGuard(['MAGASINIER'])]
  },
  {
    path: 'chefatelier',
    loadComponent: () => import('./atelier-dashboard/atelier-dashboard').then(m => m.AtelierDashboard),
    canActivate: [roleGuard(['CHEF_ATELIER'])]
  }
];
