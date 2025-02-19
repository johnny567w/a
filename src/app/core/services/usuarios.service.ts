import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getUsuarioByCorreo(correo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/correo/${correo}`);
  }

  getUsuarioByCedula(cedula: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/cedula/${cedula}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(this.apiUrl, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
