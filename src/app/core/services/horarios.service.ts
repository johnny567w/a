import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from '../../models/horario.model';
import { TipoHorario } from '../../models/tipo-horario.model';
import { ExceptionHorario } from '../../models/exception-horario.model';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private apiUrl = 'http://localhost:8080/api/horarios';

  constructor(private http: HttpClient) {}

  // 📌 Métodos para Tipos de Horarios
  getAllTiposHorarios(): Observable<TipoHorario[]> {
    return this.http.get<TipoHorario[]>(`${this.apiUrl}/tipos`);
  }

  getTipoHorarioById(id: number): Observable<TipoHorario> {
    return this.http.get<TipoHorario>(`${this.apiUrl}/tipos/${id}`);
  }

  // 📌 Métodos para Horarios
  getAllHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }

  getHorarioById(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.apiUrl}/${id}`);
  }

  createHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  updateHorario(horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(this.apiUrl, horario);
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 📌 Métodos para Excepciones de Horarios
  getAllExceptionHorarios(): Observable<ExceptionHorario[]> {
    return this.http.get<ExceptionHorario[]>(`${this.apiUrl}/exception-horarios`);
  }

  getExceptionHorarioById(id: number): Observable<ExceptionHorario> {
    return this.http.get<ExceptionHorario>(`${this.apiUrl}/exception-horarios/${id}`);
  }

  createExceptionHorario(exceptionHorario: ExceptionHorario): Observable<ExceptionHorario> {
    return this.http.post<ExceptionHorario>(`${this.apiUrl}/exception-horarios`, exceptionHorario);
  }

  updateExceptionHorario(exceptionHorario: ExceptionHorario): Observable<ExceptionHorario> {
    return this.http.put<ExceptionHorario>(`${this.apiUrl}/exception-horarios`, exceptionHorario);
  }

  deleteExceptionHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exception-horarios/${id}`);
  }
}
