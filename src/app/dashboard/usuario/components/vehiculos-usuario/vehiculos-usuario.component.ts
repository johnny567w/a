import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vehiculo } from '../../../../models/vehiculo.model';
import { VehiculosService } from '../../../../core/services/vehiculos.service';
import { AuthService } from '../../../../auth/auth.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehiculos-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculos-usuario.component.html',
  styleUrl: './vehiculos-usuario.component.scss'
})
export class VehiculosUsuarioComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  vehiculoSeleccionado: Vehiculo | null = null;
  vehiculoForm!: FormGroup;
  usuarioId!: number;

  constructor(
    private vehiculoService: VehiculosService,
    private authService: AuthService,
    private usuarioService: UsuariosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.inicializarFormulario();
    
  }

  obtenerUsuarioActual(): void {
    const usuarioAuth = this.authService.getUser();

    if (!usuarioAuth || !usuarioAuth.username) {
      alert("Error: No se encontró el usuario autenticado.");
      return;
    }

    this.usuarioService.getUsuarioByCorreo(usuarioAuth.username).subscribe({
      next: (usuario) => {
        this.usuarioId = usuario.id;
        this.cargarVehiculos();
      },
      error: (err) => {
        console.error("Error al obtener usuario:", err);
      }
    });
  }

  cargarVehiculos(): void {
    this.vehiculoService.getVehiculosByUsuarioId(this.usuarioId).subscribe({
      next: (vehiculos) => {
        this.vehiculos = vehiculos;
      },
      error: (err) => {
        console.error("Error al cargar vehículos:", err);
      }
    });
  }

  inicializarFormulario(): void {
    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]]
    });
  }

  guardarVehiculo(): void {
    if (!this.vehiculoForm.valid) {
      alert("Por favor, completa el formulario correctamente.");
      return;
    }
  
    const usuarioAuth = this.authService.getUser();
  
    if (!usuarioAuth || !usuarioAuth.username) {
      alert("Error: No se encontró el usuario autenticado.");
      return;
    }
  
    this.usuarioService.getUsuarioByCorreo(usuarioAuth.username).subscribe({
      next: (usuario) => {
        if (!usuario || !usuario.id) {
          alert("Error: No se encontró el usuario.");
          return;
        }
  
        const vehiculo: Vehiculo = {
          id: this.vehiculoSeleccionado ? this.vehiculoSeleccionado.id : 0,
          placa: this.vehiculoForm.value.placa,
          usuario: usuario // Aquí se envía el usuario completo
        };
  
        if (this.vehiculoSeleccionado) {
          this.vehiculoService.updateVehiculo(vehiculo).subscribe({
            next: () => {
              this.vehiculos = this.vehiculos.map(v => v.id === vehiculo.id ? vehiculo : v);
              this.cancelarEdicion();
            },
            error: (err) => {
              console.error("Error al actualizar vehículo:", err);
            }
          });
        } else {
          this.vehiculoService.createVehiculo(vehiculo).subscribe({
            next: (nuevoVehiculo) => {
              this.vehiculos.push(nuevoVehiculo);
              this.vehiculoForm.reset();
            },
            error: (err) => {
              console.error("Error al agregar vehículo:", err);
            }
          });
        }
      },
      error: (err) => {
        console.error("Error al obtener el usuario:", err);
      }
    });
  }
  

  editarVehiculo(vehiculo: Vehiculo): void {
    this.vehiculoSeleccionado = vehiculo;
    this.vehiculoForm.patchValue({ placa: vehiculo.placa });
  }

  cancelarEdicion(): void {
    this.vehiculoSeleccionado = null;
    this.vehiculoForm.reset();
  }

  eliminarVehiculo(id: number): void {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      this.vehiculoService.deleteVehiculo(id).subscribe({
        next: () => {
          this.vehiculos = this.vehiculos.filter(v => v.id !== id);
        },
        error: (err) => {
          console.error("Error al eliminar vehículo:", err);
        }
      });
    }
  }
}
