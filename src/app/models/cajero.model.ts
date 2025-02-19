import { Persona } from './persona.model';

export interface Cajero {
  id: number;
  sueldo: number;
  fechaIngreso: string;
  persona: Persona;
}
