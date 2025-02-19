import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from '../../models/espacio.model';

@Injectable({
  providedIn: 'root'
})
export class EspaciosService {
  private apiUrl = 'http://localhost:8080/api/espacios';

  constructor(private http: HttpClient) {}

  getAllEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(this.apiUrl);
  }

  getEspacioById(id: number): Observable<Espacio> {
    return this.http.get<Espacio>(`${this.apiUrl}/${id}`);
  }

  createEspacio(espacio: Espacio): Observable<Espacio> {
    return this.http.post<Espacio>(this.apiUrl, espacio);
  }

  updateEspacio(espacio: Espacio): Observable<Espacio> {
    return this.http.put<Espacio>(this.apiUrl, espacio);
  }

  deleteEspacio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marcarReservado(id: number): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}/${id}/reservar`, {});
  }

  marcarOcupado(id: number): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}/${id}/ocupar`, {});
  }

  desmarcarReservado(id: number): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}/${id}/desmarcar-reservado`, {});
  }

  desmarcarOcupado(id: number): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}/${id}/desmarcar-ocupado`, {});
  }
  cancelarContrato(idContrato: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contratos/${idContrato}`);
  }
  liberarEspacio(idContrato: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/espacios/liberar/${idContrato}`, {});
  }
  
}
