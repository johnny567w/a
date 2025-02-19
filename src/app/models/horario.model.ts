import { TipoHorario } from './tipo-horario.model';

export interface Horario {
  id: number;
  horaApertura: string;
  horaCierre: string;
  tipoHorario: TipoHorario;
}
