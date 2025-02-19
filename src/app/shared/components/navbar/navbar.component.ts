import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
  
  navigateToSignup() {
    this.router.navigate(['/auth/register']);
  }
}  