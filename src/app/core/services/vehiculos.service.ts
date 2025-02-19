import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private apiUrl = 'http://localhost:8080/api/vehiculos';

  constructor(private http: HttpClient) {}

  getAllVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.apiUrl);
  }

  getVehiculoById(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/${id}`);
  }

  getVehiculoByPlaca(placa: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/placa/${placa}`);
  }


  createVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.apiUrl, vehiculo);
  }

  updateVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(this.apiUrl, vehiculo);
  }

  deleteVehiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getVehiculosByUsuarioId(id : number): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/user/${id}`);
  }
}
