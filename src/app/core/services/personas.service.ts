import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private apiUrl = 'http://localhost:8080/api/personas'; 

  constructor(private http: HttpClient) {}

  getAllPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  getPersonaById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }

  getPersonaByCedula(cedula: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/cedula/${cedula}`);
  }

  getPersonaByCorreo(correo: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/correo/${correo}`);
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(this.apiUrl, persona);
  }

  deletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
