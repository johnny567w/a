import { Espacio } from './espacio.model';
import { Vehiculo } from './vehiculo.model';
import { ClienteOcasional } from './cliente-ocasional.model';

export interface Ticket {
  id: number;
  fechaEmision: string; 
  horaEntrada: string;   
  horaSalida?: string;   
  montoTotal?: number;  

  espacio: Espacio;
  vehiculo?: Vehiculo;           // Puede ser nulo (si el ticket es de un cliente ocasional)
  clienteOcasional?: ClienteOcasional;  // Puede ser nulo (si el ticket es de un usuario registrado)
}
