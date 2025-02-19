import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './usuario-dashboard.component.html',
  styleUrl: './usuario-dashboard.component.scss'
})
export class UsuarioDashboardComponent {
  menuOpen = false; 
  usuario: any = null;
  nombreUsuarioActual: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUser();
    this.nombreUsuarioActual = this.usuario ? this.usuario.nombre : 'Usuario';
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
} 
