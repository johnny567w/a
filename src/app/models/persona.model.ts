import { Rol } from "./rol.model";

export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    correo: string;
    password?: string;
    fechaNacimiento: string;
    telefono?: string;
    direccion?: string;
    estado: string;
    genero: string;
    rol: Rol;
  }
  