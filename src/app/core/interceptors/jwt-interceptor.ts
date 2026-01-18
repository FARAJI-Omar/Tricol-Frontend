import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserDataService } from '../services/user-data-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userDataService = inject(UserDataService);
  const token = userDataService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
