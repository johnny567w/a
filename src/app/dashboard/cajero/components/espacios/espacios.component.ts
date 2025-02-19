import { Component, OnInit } from '@angular/core';
import { Espacio } from '../../../../models/espacio.model';
import { EspaciosService } from '../../../../core/services/espacios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../../../models/ticket.model';
import { VehiculosService } from '../../../../core/services/vehiculos.service';
import { TicketsService } from '../../../../core/services/tickets.service';
import { TarifaService } from '../../../../core/services/tarifa.service';
import { ClienteOcasional } from '../../../../models/cliente-ocasional.model';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.scss'
})
export class EspaciosComponent implements OnInit {
  espacios: Espacio[] = [];
  espaciosPaginados: Espacio[] = [];
  paginaActual: number = 0;
  espaciosPorPagina: number = 25;
  vehiculoPlaca: string = ''; 
  espacioId: number | null = null; 
  espacioSeleccionado: Espacio | null = null;
  tarifaActual: number = 0;
  mensaje: string = ''; 
  mensajeClase: string = ''; 
  clienteNombre: string = '';
  clientePlaca: string = ''; 


  mostrarMensaje(texto: string, tipo: 'success' | 'error') {
    this.mensaje = texto;
    this.mensajeClase = tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';

    setTimeout(() => {
      this.mensaje = ''; // Ocultar mensaje después de unos segundos
    }, 4000);
  }


  constructor(
    private espacioService: EspaciosService,
    private vehiculoService: VehiculosService,
    private ticketService: TicketsService,
    private tarifaService: TarifaService
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
    this.cargarTarifa();
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


  cargarEspacios(): void {
    this.espacioService.getAllEspacios().subscribe({
      next: (espacios) => {
        this.espacios = espacios;
        this.paginarEspacios();
      },
      error: (err) => {
        console.error("Error al cargar los espacios:", err);
      }
    });
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

  ocuparEspacio(): void {
    if (!this.vehiculoPlaca || !this.espacioId) {
      this.mostrarMensaje("Por favor, ingresa la placa del vehículo y el ID del espacio.", 'error');
      return;
    }
  
    const espacio = this.espacios.find(e => e.id === this.espacioId);
    if (!espacio) {
      this.mostrarMensaje("Espacio no encontrado.", 'error');
      return;
    }
  
    if (espacio.ocupado || espacio.reservado) {
      this.mostrarMensaje("Este espacio ya está ocupado o reservado.", 'error');
      return;
    }
  
    this.vehiculoService.getVehiculoByPlaca(this.vehiculoPlaca).subscribe({
      next: (vehiculo) => {
        if (!vehiculo) {
          this.mostrarMensaje("Vehículo no encontrado en la base de datos.", 'error');
          return;
        }
  
        const nuevoTicket: Ticket = {
          id: 0,
          fechaEmision: new Date().toISOString().split('T')[0],
          horaEntrada: new Date().toTimeString().split(' ')[0],
          espacio: espacio,
          vehiculo: vehiculo
        };
  
        this.ticketService.createTicket(nuevoTicket).subscribe({
          next: () => {
            this.espacioService.marcarOcupado(espacio.id).subscribe({
              next: () => {
                espacio.ocupado = true;
                this.mostrarMensaje("Espacio marcado como ocupado.", 'success');
  
                // 🔹 Limpiar campos después de éxito
                this.vehiculoPlaca = '';
                this.espacioId = null;
              },
              error: () => this.mostrarMensaje("Error al marcar el espacio como ocupado.", 'error')
            });
          },
          error: () => this.mostrarMensaje("Error al generar el ticket.", 'error')
        });
      },
      error: () => this.mostrarMensaje("Error al buscar el vehículo.", 'error')
    });
  }
  
    
  liberarEspacio(espacio: Espacio): void {
    if (!confirm("¿Estás seguro de liberar este espacio?")) return;
  
    this.ticketService.getTicketByEspacio(espacio.id).subscribe({
      next: (ticket) => {
        if (!ticket) {
          this.mostrarMensaje("No se encontró un ticket asociado a este espacio.", 'error');
          return;
        }
  
        const horaSalida = new Date();
        const horaEntrada = new Date(ticket.fechaEmision + 'T' + ticket.horaEntrada);
        const diferenciaHoras = Math.ceil((horaSalida.getTime() - horaEntrada.getTime()) / (1000 * 60 * 60));
        const montoTotal = diferenciaHoras * this.tarifaActual;
  
        const ticketActualizado: Ticket = {
          ...ticket,
          horaSalida: horaSalida.toTimeString().split(' ')[0], 
          montoTotal: montoTotal
        };
  
        this.ticketService.updateTicket(ticketActualizado).subscribe({
          next: () => {
            this.espacioService.desmarcarOcupado(espacio.id).subscribe({
              next: () => {
                espacio.ocupado = false;
                this.mostrarMensaje(`Espacio #${espacio.id} liberado. Total: $${montoTotal.toFixed(2)}`, 'success');
  
                // 🔹 Limpiar campos después de éxito
                this.vehiculoPlaca = '';
                this.espacioId = null;
              },
              error: () => this.mostrarMensaje("Error al marcar el espacio como disponible.", 'error')
            });
          },
          error: () => this.mostrarMensaje("Error al actualizar el ticket.", 'error')
        });
      },
      error: () => this.mostrarMensaje("Error al obtener el ticket asociado.", 'error')
    });
  }
  

  ocuparEspacioConClienteOcasional(): void {
    if (!this.clienteNombre || !this.clientePlaca || !this.espacioId) {
      this.mostrarMensaje("Por favor, ingrese el nombre, la placa y el ID del espacio.", 'error');
      return;
    }
  
    const espacio = this.espacios.find(e => e.id === this.espacioId);
    if (!espacio) {
      this.mostrarMensaje("Espacio no encontrado.", 'error');
      return;
    }
  
    if (espacio.ocupado || espacio.reservado) {
      this.mostrarMensaje("Este espacio ya está ocupado o reservado.", 'error');
      return;
    }
  
    this.ticketService.getClienteOcasionalByPlaca(this.clientePlaca).subscribe({
      next: (clienteExistente) => {
        if (clienteExistente) {
          this.generarTicketConCliente(clienteExistente, espacio);
        } else {
          this.crearClienteOcasional(espacio);
        }
      },
      error: () => this.crearClienteOcasional(espacio)
    });
  }
  
  
  private crearClienteOcasional(espacio: Espacio): void {
    const nuevoCliente: ClienteOcasional = {
      id: 0, 
      nombre: this.clienteNombre,
      placa: this.clientePlaca
    };
  
    this.ticketService.createClienteOcasional(nuevoCliente).subscribe({
      next: (clienteCreado) => {
        this.generarTicketConCliente(clienteCreado, espacio);
  
        // 🔹 Limpiar campos después de éxito
        this.clienteNombre = '';
        this.clientePlaca = '';
        this.espacioId = null;
      },
      error: () => this.mostrarMensaje("Error al registrar el cliente ocasional.", 'error')
    });
  }
  
  
  private generarTicketConCliente(cliente: ClienteOcasional, espacio: Espacio): void {
    const nuevoTicket: Ticket = {
      id: 0,
      fechaEmision: new Date().toISOString().split('T')[0], 
      horaEntrada: new Date().toTimeString().split(' ')[0], 
      espacio: espacio,
      clienteOcasional: cliente 
    };
  
    this.ticketService.createTicket(nuevoTicket).subscribe({
      next: () => {
        this.espacioService.marcarOcupado(espacio.id).subscribe({
          next: () => {
            espacio.ocupado = true;
            this.mostrarMensaje("Espacio marcado como ocupado para Cliente Ocasional.", 'success');
          },
          error: () => this.mostrarMensaje("Error al marcar el espacio como ocupado.", 'error')
        });
      },
      error: () => this.mostrarMensaje("Error al generar el ticket.", 'error')
    });
  }
  
  
  
  
}
