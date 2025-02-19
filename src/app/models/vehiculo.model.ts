import { Usuario } from './usuario.model';

export interface Vehiculo {
  id: number;
  placa: string;
  usuario: Usuario;
}
