import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarifa } from '../../models/tarifa.model';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private apiUrl = 'http://localhost:8080/api/tarifas';

  constructor(private http: HttpClient) {}

  getAllTarifas(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(this.apiUrl);
  }

  getTarifaById(id: number): Observable<Tarifa> {
    return this.http.get<Tarifa>(`${this.apiUrl}/${id}`);
  }

  createTarifa(tarifa: Tarifa): Observable<Tarifa> {
    return this.http.post<Tarifa>(this.apiUrl, tarifa);
  }

  updateTarifa(tarifa: Tarifa): Observable<Tarifa> {
    return this.http.put<Tarifa>(this.apiUrl, tarifa);
  }

  deleteTarifa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTarifaActiva(): Observable<Tarifa> {
    return this.http.get<Tarifa>(`${this.apiUrl}/activa`);
  }

  activarTarifa(id: number): Observable<Tarifa> {
    return this.http.put<Tarifa>(`${this.apiUrl}/${id}/activar`, {});
  }
}
