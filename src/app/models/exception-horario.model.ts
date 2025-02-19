import { Horario } from './horario.model';

export interface ExceptionHorario {
  id: number;
  fecha: string;
  horaApertura?: string; 
  horaCierre?: string; 
  cierreTodoDia: boolean;
  horario: Horario;
}
