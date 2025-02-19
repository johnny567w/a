import { Persona } from './persona.model';

export interface Usuario {
  id: number;
  fechaRegistro: string;
  persona: Persona;
}
