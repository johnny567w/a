import { Component, OnInit } from '@angular/core';
import { Contrato } from '../../../../models/contrato.model';
import { Usuario } from '../../../../models/usuario.model';
import { Espacio } from '../../../../models/espacio.model';
import { ContratosService } from '../../../../core/services/contratos.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TarifaService } from '../../../../core/services/tarifa.service';
import { EspaciosService } from '../../../../core/services/espacios.service';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.scss'
})
export class ContratosComponent implements OnInit {
  contratos: Contrato[] = [];
  contratosPaginados: Contrato[] = [];
  paginaActual: number = 0;
  contratosPorPagina: number = 20;
  contratoForm!: FormGroup;
  contratoEditando: Contrato | null = null;
  mensaje: string = '';
  mensajeClase: string = '';
  montoTotal: number = 0;
  tarifaActual: number = 0;
  contratoEditForm!: FormGroup;

  constructor(
    private contratosService: ContratosService,
    private usuariosService: UsuariosService,
    private tarifaService: TarifaService,
    private espaciosService: EspaciosService,

    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarTarifa();
    this.cargarContratos();
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    this.contratoForm = this.fb.group({
      usuarioCedula: ['', Validators.required],
      espacioId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      montoTotal: [{ value: '', disabled: true }, Validators.required]
    });
  
    this.contratoEditForm = this.fb.group({ 
      usuarioCedula: ['', Validators.required],
      espacioId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      montoTotal: [{ value: '', disabled: true }, Validators.required]
    });
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

  cargarContratos(): void {
    this.contratosService.getAllContratos().subscribe({
      next: (contratos) => {
        this.contratos = contratos;
        this.paginarContratos();
      },
      error: (err) => {
        this.mostrarMensaje("Error al cargar contratos.", 'error');
        console.error("Error al cargar contratos:", err);
      }
    });
  }

  paginarContratos(): void {
    const inicio = this.paginaActual * this.contratosPorPagina;
    const fin = inicio + this.contratosPorPagina;
    this.contratosPaginados = this.contratos.slice(inicio, fin);
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 0 && nuevaPagina * this.contratosPorPagina < this.contratos.length) {
      this.paginaActual = nuevaPagina;
      this.paginarContratos();
    }
  }

  agregarContrato(): void {
    if (!this.contratoForm.valid) {
      this.mostrarMensaje("Por favor, completa todos los campos.", 'error');
      return;
    }
  
    console.log("Valores del formulario:", this.contratoForm.value);
  
    const fechaInicioStr = this.contratoForm.value.fechaInicio;
    const fechaFinStr = this.contratoForm.value.fechaFin;
  
    if (!fechaInicioStr || !fechaFinStr) {
      this.mostrarMensaje("Las fechas son obligatorias.", 'error');
      return;
    }
  
    const fechaInicio = new Date(fechaInicioStr);
    const fechaFin = new Date(fechaFinStr);
  
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      this.mostrarMensaje("Las fechas no son válidas.", 'error');
      return;
    }
  
    if (fechaInicio >= fechaFin) {
      this.mostrarMensaje("La fecha de inicio debe ser anterior a la fecha de fin.", 'error');
      return;
    }
  
    const diferenciaDias = Math.max(1, (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const montoTotal = diferenciaDias * this.tarifaActual;
    const espacioId = this.contratoForm.value.espacioId;
    const cedula = this.contratoForm.value.usuarioCedula;
  
    this.usuariosService.getUsuarioByCedula(cedula).subscribe({
      next: (usuario) => {
        if (!usuario) {
          this.mostrarMensaje("No se encontró un usuario con la cédula ingresada.", 'error');
          return;
        }
  
        const nuevoContrato: Contrato = {
          id: 0,
          usuario: usuario, 
          espacio: { id: espacioId } as Espacio,
          fechaInicio: fechaInicioStr,
          fechaFin: fechaFinStr,
          montoTotal: montoTotal
        };
  
        console.log("Enviando contrato:", nuevoContrato);
  
        this.contratosService.createContrato(nuevoContrato).subscribe({
          next: () => {
            // 🟢 Primero mostrar mensaje de éxito
            this.mostrarMensaje("Contrato agregado con éxito.", 'success');
  
            // 🔵 Luego marcar el espacio como reservado
            this.espaciosService.marcarReservado(espacioId).subscribe({
              next: () => {
                console.log(`Espacio #${espacioId} marcado como reservado.`);
                this.cargarContratos();  // Refrescar la lista de contratos
              },
              error: (err) => {
                console.error("Error al marcar espacio como reservado:", err);
                this.mostrarMensaje("Contrato agregado, pero no se pudo marcar el espacio como reservado.", 'error');
              }
            });
  
            this.contratoForm.reset();
          },
          error: (err) => {
            console.error("Error al agregar contrato:", err);
            this.mostrarMensaje("Hubo un error al agregar el contrato.", 'error');
          }
        });
      },
      error: (err) => {
        console.error("Error al buscar usuario por cédula:", err);
        this.mostrarMensaje("Error al buscar el usuario.", 'error');
      }
    });
  }
  
  

  editarContrato(contrato: Contrato): void {
    this.contratoEditando = { ...contrato }; // 🔹 Guardamos el contrato completo
    
    this.contratoEditForm.patchValue({
      usuarioCedula: contrato.usuario.persona.cedula,
      espacioId: contrato.espacio.id,
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin,
      montoTotal: contrato.montoTotal
    });
  
    this.calcularMontoTotal(true);
  }
  
  
  
  
  cancelarEdicion(): void {
    this.contratoEditando = null;
  }
  

  guardarEdicion(): void {
    if (!this.contratoEditando || !this.contratoEditForm.valid) {
      this.mostrarMensaje("Por favor, completa todos los campos.", 'error');
      return;
    }
  
    const fechaInicioStr = this.contratoEditForm.value.fechaInicio;
    const fechaFinStr = this.contratoEditForm.value.fechaFin;
    const espacioId = this.contratoEditForm.value.espacioId;
    const cedula = this.contratoEditForm.value.usuarioCedula;
  
    if (!fechaInicioStr || !fechaFinStr) {
      this.mostrarMensaje("Las fechas son obligatorias.", 'error');
      return;
    }
  
    const fechaInicio = new Date(fechaInicioStr);
    const fechaFin = new Date(fechaFinStr);
  
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      this.mostrarMensaje("Las fechas no son válidas.", 'error');
      return;
    }
  
    if (fechaInicio >= fechaFin) {
      this.mostrarMensaje("La fecha de inicio debe ser anterior a la fecha de fin.", 'error');
      return;
    }
  
    const diferenciaDias = Math.max(1, (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const montoTotal = diferenciaDias * this.tarifaActual;
  
    // 🔹 Buscar el usuario completo antes de actualizar el contrato
    this.usuariosService.getUsuarioByCedula(cedula).subscribe({
      next: (usuario) => {
        if (!usuario) {
          this.mostrarMensaje("No se encontró un usuario con la cédula ingresada.", 'error');
          return;
        }
  
        const contratoActualizado: Contrato = {
          id: this.contratoEditando?.id ?? 0,  // 🔹 Aseguramos que tenga un número válido
          usuario: usuario,  // 🔹 Aseguramos que enviamos el usuario completo
          espacio: { id: espacioId } as Espacio,
          fechaInicio: fechaInicioStr,
          fechaFin: fechaFinStr,
          montoTotal: montoTotal
        };
  
        console.log("Actualizando contrato:", contratoActualizado);
  
        this.contratosService.updateContrato(contratoActualizado).subscribe({
          next: (updatedContrato) => {
            this.contratos = this.contratos.map(c => c.id === updatedContrato.id ? updatedContrato : c);
            this.paginarContratos();
            this.contratoEditando = null;
            this.mostrarMensaje("Contrato actualizado con éxito.", 'success');
          },
          error: (err) => {
            this.mostrarMensaje("Error al actualizar contrato.", 'error');
            console.error("Error al actualizar contrato:", err);
          }
        });
      },
      error: (err) => {
        console.error("Error al buscar usuario por cédula:", err);
        this.mostrarMensaje("Error al buscar el usuario.", 'error');
      }
    });
  }
  
  
  

  eliminarContrato(id: number): void {
    if (!confirm("¿Estás seguro de eliminar este contrato?")) return;
  
    // 🟢 Obtener el contrato antes de eliminarlo
    const contrato = this.contratos.find(c => c.id === id);
    if (!contrato) {
      this.mostrarMensaje("No se encontró el contrato a eliminar.", 'error');
      return;
    }
  
    const espacioId = contrato.espacio.id;
  
    this.contratosService.deleteContrato(id).subscribe({
      next: () => {
        this.contratos = this.contratos.filter(c => c.id !== id);
        this.paginarContratos();
        this.mostrarMensaje("Contrato eliminado con éxito.", 'success');
  
        this.espaciosService.desmarcarReservado(espacioId).subscribe({
          next: () => console.log(`Espacio #${espacioId} marcado como disponible.`),
          error: (err) => {
            console.error("Error al marcar espacio como disponible:", err);
            this.mostrarMensaje("El contrato fue eliminado, pero el espacio no se pudo liberar.", 'error');
          }
        });
      },
      error: (err) => {
        this.mostrarMensaje("Error al eliminar contrato.", 'error');
        console.error("Error al eliminar contrato:", err);
      }
    });
  }
  

  mostrarMensaje(texto: string, tipo: 'success' | 'error') {
    this.mensaje = texto;
    this.mensajeClase = tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';

    setTimeout(() => {
      this.mensaje = ''; 
    }, 4000);
  }

  calcularMontoTotal(editando: boolean = false): void {
    const form = editando ? this.contratoEditForm : this.contratoForm; 
  
    const fechaInicioStr = form.value.fechaInicio;
    const fechaFinStr = form.value.fechaFin;
  
    if (!fechaInicioStr || !fechaFinStr) {
      form.patchValue({ montoTotal: 0 });
      return;
    }
  
    const fechaInicio = new Date(fechaInicioStr);
    const fechaFin = new Date(fechaFinStr);
  
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      console.warn("Fechas no válidas");
      form.patchValue({ montoTotal: 0 });
      return;
    }
  
    const diferenciaDias = Math.max(1, (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const nuevoMontoTotal = diferenciaDias * this.tarifaActual;
  
    form.patchValue({ montoTotal: nuevoMontoTotal.toFixed(2) });
  }
  
}