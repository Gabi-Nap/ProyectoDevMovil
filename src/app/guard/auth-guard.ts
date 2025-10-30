import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../auth/authService';
import { inject } from '@angular/core';

/**
 * @function authGuard
 * @description 
 * Este guard se utiliza para proteger rutas en la aplicación.  
 * Verifica si el usuario está autenticado antes de permitirle acceder a una ruta específica.
 * Si el usuario **no está autenticado**, lo redirige automáticamente a la página de **login**.
 * 
 * @param {ActivatedRouteSnapshot} route - Información de la ruta que se intenta acceder.
 * @param {RouterStateSnapshot} state - Estado actual del enrutador (URL, historial, etc.).
 * 
 * @returns {boolean} 
 * Devuelve `true` si el usuario está autenticado (puede acceder a la ruta),  
 * o `false` si no lo está (y lo redirige al login).
 */

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};