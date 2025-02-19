import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Contrato } from '../../models/contrato.model';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private apiUrl = 'http://localhost:8080/api/contratos';

  constructor(private http: HttpClient) {}

  getAllContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.apiUrl);
  }

  getContratosPorFecha(fechaInicio: string): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/fecha/${fechaInicio}`);
  }

  getContratoById(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.apiUrl}/${id}`);
  }

  createContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.apiUrl, contrato);
  }

  updateContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(this.apiUrl, contrato);
  }

  deleteContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  cancelarContrato(idContrato: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contratos/${idContrato}`);
  }
  liberarEspacio(idContrato: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/espacios/liberar/${idContrato}`, {});
  }
  
}