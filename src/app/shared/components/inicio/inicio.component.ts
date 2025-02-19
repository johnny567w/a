import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { AcercaDeComponent } from '../acerca-de/acerca-de.component';
import { InformacionComponent } from '../informacion/informacion.component';
import { MainContentComponent } from '../main-content/main-content.component';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ MapaComponent,FooterComponent,RouterModule, FormsModule, CommonModule, RouterModule, CommonModule, ContactoComponent, AcercaDeComponent, InformacionComponent, MainContentComponent,NavbarComponent],
  templateUrl: './inicio.component.html',
  styles: ``
})
export class InicioComponent {
  showHome: boolean = true;
  showOnlyHeader: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        this.showOnlyHeader = ['/login', '/signup'].includes(url);
        this.showHome = url === '/inicio';    }
       });

      }
  }
  




