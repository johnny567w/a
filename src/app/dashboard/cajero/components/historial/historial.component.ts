import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../../../core/services/contratos.service';
import { TicketsService } from '../../../../core/services/tickets.service';
import { Contrato } from '../../../../models/contrato.model';
import { Ticket } from '../../../../models/ticket.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit {
  Object = Object;
  contratos: Contrato[] = [];
  tickets: Ticket[] = [];
  periodoSeleccionado: 'DIA' | 'SEMANA' | 'MES' = 'DIA';

  // 🔹 Variables para reporte de ganancias
  totalGananciasUsuarios: number = 0;
  totalGananciasClientesOcasionales: number = 0;

  // 🔹 Mapa para almacenar ingresos por espacio
  ingresosPorEspacio: { [espacioId: number]: number } = {};

  constructor(
    private contratosService: ContratosService,
    private ticketsService: TicketsService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const { fechaInicio } = this.obtenerRangoFechas();

    this.contratosService.getContratosPorFecha(fechaInicio).subscribe({
      next: (contratos) => this.contratos = contratos,
      error: (err) => console.error("Error al obtener contratos:", err)
    });

    this.ticketsService.getTicketsPorFecha(fechaInicio).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.calcularGanancias(); // 🔹 Cálculo de ganancias
        this.calcularIngresosPorEspacio(); // 🔹 Cálculo de ingresos por espacio
      },
      error: (err) => console.error("Error al obtener tickets:", err)
    });
  }

  obtenerRangoFechas(): { fechaInicio: string; fechaFin: string } {
    const hoy = new Date();
    let fechaInicio = new Date();
    let fechaFin = new Date();

    if (this.periodoSeleccionado === 'DIA') {
      fechaInicio = hoy;
      fechaFin = hoy;
    } else if (this.periodoSeleccionado === 'SEMANA') {
      fechaInicio.setDate(hoy.getDate() - 7);
    } else if (this.periodoSeleccionado === 'MES') {
      fechaInicio.setMonth(hoy.getMonth() - 1);
    }

    return {
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0]
    };
  }

  cambiarPeriodo(periodo: 'DIA' | 'SEMANA' | 'MES'): void {
    this.periodoSeleccionado = periodo;
    this.cargarHistorial();
  }

  // 🔹 Método para calcular las ganancias
  calcularGanancias(): void {
    this.totalGananciasUsuarios = this.tickets
      .filter(ticket => ticket.vehiculo?.usuario)
      .reduce((total, ticket) => total + (ticket.montoTotal || 0), 0);

    this.totalGananciasClientesOcasionales = this.tickets
      .filter(ticket => ticket.clienteOcasional)
      .reduce((total, ticket) => total + (ticket.montoTotal || 0), 0);
  }

  // 🔹 Método para calcular ingresos por cada espacio
  calcularIngresosPorEspacio(): void {
    this.ingresosPorEspacio = {};

    this.tickets.forEach(ticket => {
      if (ticket.espacio && ticket.montoTotal) {
        const espacioId = ticket.espacio.id;
        if (!this.ingresosPorEspacio[espacioId]) {
          this.ingresosPorEspacio[espacioId] = 0;
        }
        this.ingresosPorEspacio[espacioId] += ticket.montoTotal;
      }
    });
  }

  parseEspacioId(espacioId: string): number {
    return parseInt(espacioId, 10);
  }
}
