import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const usuario = this.authService.getUser();

    if (!usuario) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const rolRequerido = route.data['role'];
    if (rolRequerido && usuario.role !== rolRequerido) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
