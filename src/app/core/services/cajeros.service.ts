import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cajero } from '../../models/cajero.model';

@Injectable({
  providedIn: 'root'
})
export class CajerosService {
  private apiUrl = 'http://localhost:8080/api/cajeros';

  constructor(private http: HttpClient) {}

  getAllCajeros(): Observable<Cajero[]> {
    return this.http.get<Cajero[]>(this.apiUrl);
  }

  getCajeroById(id: number): Observable<Cajero> {
    return this.http.get<Cajero>(`${this.apiUrl}/${id}`);
  }

  createCajero(cajero: Cajero): Observable<Cajero> {
    return this.http.post<Cajero>(this.apiUrl, cajero);
  }

  updateCajero(cajero: Cajero): Observable<Cajero> {
    return this.http.put<Cajero>(this.apiUrl, cajero);
  }

  deleteCajero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
