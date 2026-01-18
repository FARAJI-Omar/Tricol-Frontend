import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserDataService } from '../services/user-data-service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const userDataService = inject(UserDataService);
    const router = inject(Router);

    const userRole = userDataService.getRole();

    // If no user role (not logged in), redirect to login
    if (!userRole) {
      router.navigate(['/login']);
      return false;
    }

    // Check if user's role is in allowed roles
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // If role doesn't match, redirect to home or their dashboard
    router.navigate(['/']);
    return false;
  };
};
