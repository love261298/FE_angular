import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  console.log(isAuth);
  if (isAuth) return true;

  if (!isAuth && !state.url.includes('/login')) {
    console.warn('Unauthorized access - Redirecting to login');
  }

  return router.createUrlTree(['/login']);
};
