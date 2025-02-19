import { Usuario } from './usuario.model';
import { Espacio } from './espacio.model';

export interface Contrato {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  montoTotal: number;
  usuario: Usuario;
  espacio: Espacio;
}
