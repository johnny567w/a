import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Espacio } from '../../../../models/espacio.model';
import { Contrato } from '../../../../models/contrato.model';
import { Usuario } from '../../../../models/usuario.model';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EspaciosService } from '../../../../core/services/espacios.service';
import { TarifaService } from '../../../../core/services/tarifa.service';
import { ContratosService } from '../../../../core/services/contratos.service';
import { AuthService } from '../../../../auth/auth.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuario-contratos',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-contratos.component.html',
  styleUrl: './usuario-contratos.component.scss'
})
export class UsuarioContratosComponent implements OnInit {
  espacios: Espacio[] = [];
  contratos: Contrato[] = [];
  espaciosPaginados: Espacio[] = [];
  paginaActual: number = 0;
  espaciosPorPagina: number = 25;
  tarifaActual: number = 0;
  contratoSeleccionado: number | null = null;


  usuarioActual!: Usuario;
  espacioSeleccionado: Espacio | null = null;
  contratoForm!: FormGroup;

  constructor(
    private espacioService: EspaciosService,
    private tarifaService: TarifaService,
    private contratoService: ContratosService,
    private authService: AuthService,
    private usuarioService: UsuariosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
    this.cargarTarifa();
    this.usuarioActual = this.authService.getUser();
    this.inicializarFormulario();
    this.cargarContratosUsuario(); 
  }
  
  cargarContratosUsuario(): void {
    const usuarioAuth = this.authService.getUser(); 
  
    if (!usuarioAuth || !usuarioAuth.username) {
      console.error("Error: No se encontró el usuario autenticado.");
      return;
    }
  
    this.usuarioService.getUsuarioByCorreo(usuarioAuth.username).subscribe({
      next: (usuario) => {
        if (!usuario || !usuario.id) {
          console.error("Error: No se encontró el usuario asociado.");
          return;
        }
  
        this.contratoService.getAllContratos().subscribe({
          next: (contratos) => {
            // 🔹 Filtrar solo los contratos del usuario actual
            this.contratos = contratos.filter(c => c.usuario.id === usuario.id);
          },
          error: (err) => {
            console.error("Error al cargar los contratos del usuario:", err);
          }
        });
      },
      error: (err) => {
        console.error("No se pudo obtener el usuario asociado:", err);
      }
    });
  }
  

  cargarEspacios(): void {
    this.espacioService.getAllEspacios().subscribe(
      (espacios: Espacio[]) => {
        this.espacios = espacios;
        this.paginarEspacios();
      },
      (error) => {
        console.error('Error al cargar los espacios:', error);
      }
    );
  }

  cargarTarifa(): void {
    this.tarifaService.getTarifaActiva().subscribe(
      (tarifa) => {
        this.tarifaActual = tarifa.valor;
      },
      (error) => {
        console.error('Error al obtener la tarifa activa:', error);
      }
    );
  }

  paginarEspacios(): void {
    const inicio = this.paginaActual * this.espaciosPorPagina;
    const fin = inicio + this.espaciosPorPagina;
    this.espaciosPaginados = this.espacios.slice(inicio, fin);
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 0 && nuevaPagina * this.espaciosPorPagina < this.espacios.length) {
      this.paginaActual = nuevaPagina;
      this.paginarEspacios();
    }
  }

  obtenerClaseEstado(espacio: Espacio): string {
    if (espacio.ocupado) return 'bg-red-500 text-white';
    if (espacio.reservado) return 'bg-orange-500 text-white';
    return 'bg-green-500 text-white';
  }

  seleccionarEspacio(espacio: Espacio): void {
    if (espacio.ocupado || espacio.reservado) {
      alert('Este espacio no está disponible.');
      return;
    }
    this.espacioSeleccionado = espacio;
  }

  inicializarFormulario(): void {
    this.contratoForm = this.fb.group({
      fechaInicio: ['', [Validators.required, this.validarFecha]],
      fechaFin: ['', [Validators.required, this.validarFecha]]
    });
  }

  calcularMontoTotal(): number {
    const inicio = new Date(this.contratoForm.value.fechaInicio);
    const fin = new Date(this.contratoForm.value.fechaFin);
    const diferenciaDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(diferenciaDias, 1) * this.tarifaActual;
  }
  mostrarInformacion(idEspacio: number | null): void {
    this.contratoSeleccionado = idEspacio;
  }
  crearContrato() {
    if (!this.espacioSeleccionado || !this.contratoForm.valid) {
      alert("Selecciona un espacio válido y completa los campos.");
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
          alert("Error: No se encontró el usuario asociado.");
          return;
        }
  
        if (!this.espacioSeleccionado) {
          console.log("Error: No se encontró el espacio seleccionado.");
          return;
        }
  
        const contrato: Contrato = {
          id: 0,
          fechaInicio: this.contratoForm.value.fechaInicio,
          fechaFin: this.contratoForm.value.fechaFin,
          montoTotal: this.calcularMontoTotal(),
          usuario: usuario,
          espacio: this.espacioSeleccionado
        };
  
        this.contratoService.createContrato(contrato).subscribe({
          next: (nuevoContrato) => {
            console.log("Contrato creado con éxito.");
            this.contratos.push(nuevoContrato);
  
            if (!this.espacioSeleccionado) {
              console.log("Error: No se encontró el espacio seleccionado.");
              return;
            }

            this.espacioService.marcarReservado(this.espacioSeleccionado.id).subscribe({
              next: () => {

                if (!this.espacioSeleccionado) {
                  console.log("Error: No se encontró el espacio seleccionado.");
                  return;
                }

                console.log("Espacio marcado como reservado.");
                this.espacioSeleccionado.reservado = true;

                this.contratoForm.reset();
                this.espacioSeleccionado = null;

              },
              error: (err) => {
                console.error("Error al marcar el espacio como reservado:", err);
                alert("Hubo un problema al marcar el espacio como reservado.");
              }
            });
          },
          error: (err) => {
            console.error("Error al crear el contrato:", err);
            alert("Hubo un error al crear el contrato.");
          }
        });
      },
      error: (err) => {
        alert("No se pudo obtener el usuario asociado: " + err);
      }
    });
  }
  calcularDuracionMeses(fechaInicio: any, fechaFin: any): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
  
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return 0; 
    }
  
    const diff = fin.getTime() - inicio.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24 * 30)); 
  }
  
  calcularCostoTotal(contrato: Contrato): number {
    return contrato.montoTotal ?? 0;
  }
  getDuracionMeses(contrato: Contrato): number {
    const inicio = new Date(contrato.fechaInicio);
    const fin = new Date(contrato.fechaFin);
    return (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
  }
  validarFecha(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
  
    const fecha = new Date(control.value);
    const hoy = new Date();
    const maxFecha = new Date('2030-12-31');
  
    if (fecha < hoy || fecha > maxFecha) {
      return { fechaInvalida: true };
    }
  
    return null;
  }
  cancelarContrato(idContrato: number): void {
    if (!confirm("¿Estás seguro de que deseas cancelar este contrato?")) {
      return;
    }
  
    this.contratoService.cancelarContrato(idContrato).subscribe({
      next: () => {
        this.contratos = this.contratos.filter(c => c.id !== idContrato);
  
        this.espacioService.liberarEspacio(idContrato).subscribe({
          next: () => {
          },
          error: (err) => {
            console.error("Error al liberar el espacio:", err);
          }
        });
      },
      error: (err) => {
        alert("Hubo un problema al cancelar el contrato.");
      }
    });
  }
  
  
  
}