import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { UsuarioDashboardComponent } from './usuario-dashboard/usuario-dashboard.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { UsuarioContratosComponent } from './components/usuario-contratos/usuario-contratos.component';
import { InicioUsuarioComponent } from './components/inicio-usuario/inicio-usuario.component';
import { VehiculosUsuarioComponent } from './components/vehiculos-usuario/vehiculos-usuario.component';

export const dashboardUsuarioRoutes: Routes = [
  {
    path: '',
    component: UsuarioDashboardComponent,
    canActivate: [AuthGuard],  
    data: { role: 'Usuario' },
    children: [
      { path: 'mi-perfil', component: MiPerfilComponent },
      { path: 'contratos-usuario', component: UsuarioContratosComponent },
      { path: 'inicio-usuario', component: InicioUsuarioComponent },
      { path: 'vehiculos-usuario', component: VehiculosUsuarioComponent},
      { path: '**', redirectTo: 'inicio-usuario' } 
    ]
  }
];
