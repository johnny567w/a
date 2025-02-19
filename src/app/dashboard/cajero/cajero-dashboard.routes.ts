import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { CajeroDashboardComponent } from './cajero-dashboard/cajero-dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { EspaciosComponent } from './components/espacios/espacios.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { InicioCajeroComponent } from './components/inicio-cajero/inicio-cajero.component';
import { TarifasComponent } from './components/tarifas/tarifas.component';
import { HistorialComponent } from './components/historial/historial.component';

export const dashboardCajeroRoutes: Routes = [
  {
    path: '',
    component: CajeroDashboardComponent,
    canActivate: [AuthGuard],  
    data: { role: 'Cajero' },
    children: [
      { path: 'usuarios', component : UsuariosComponent },
      { path: 'contratos', component : ContratosComponent},
      { path: 'espacios', component : EspaciosComponent},
      { path: 'horarios', component : HorariosComponent},
      { path: 'inicio-cajero', component : InicioCajeroComponent},
      { path: 'tarifas', component : TarifasComponent},
      { path: 'historial', component : HistorialComponent},

      { path: '**', redirectTo: 'inicio-cajero' } 
    ]
  }
];
