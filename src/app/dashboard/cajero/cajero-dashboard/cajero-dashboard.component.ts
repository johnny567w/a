import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './cajero-dashboard.component.html',
  styleUrl: './cajero-dashboard.component.scss'
})
export class CajeroDashboardComponent {
  menuOpen = false; 
  cajero: any = null;
  nombreCajeroActual: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.cajero = this.authService.getUser();
    this.nombreCajeroActual = this.cajero ? this.cajero.nombre : 'Cajero';
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
