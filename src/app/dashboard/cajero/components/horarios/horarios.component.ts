import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HorariosService } from '../../../../core/services/horarios.service';
import { Horario } from '../../../../models/horario.model';
import { CommonModule } from '@angular/common';
import { ExceptionHorario } from '../../../../models/exception-horario.model';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit {
  horarios: Horario[] = [];
  horarioEditando: Horario | null = null;
  horarioForm!: FormGroup;
  localAbierto: boolean = false;
  exceptionHorarios: ExceptionHorario[] = [];
  exceptionForm!: FormGroup;
  exceptionHoy: ExceptionHorario | null = null;
  proximaExcepcion: string = '';
  excepcionActiva: boolean = false;
  horarioHoy : Horario | null | undefined = null;



  constructor(
    private horariosService: HorariosService,
    private fb: FormBuilder
  ) {}

    ngOnInit(): void {
      this.cargarHorarios();
      this.cargarExcepciones();
      this.inicializarFormularioExcepcion();  
    }
  
  inicializarFormularioExcepcion(): void {
    this.exceptionForm = this.fb.group({
      fecha: ['', Validators.required],
      horaApertura: [''],
      horaCierre: [''],
      cierreTodoDia: [false]
    });
  }
  
  

  cargarHorarios(): void {
    this.horariosService.getAllHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
        console.log("Horarios cargados:", this.horarios);
  
        if (this.horarios.length > 0) {
          this.verificarEstadoLocal(); 
        } else {
          console.warn("No se encontraron horarios.");
        }
      },
      error: (err) => {
        console.error("Error al cargar los horarios:", err);
      }
    });
  }

  cargarExcepciones(): void {
    this.horariosService.getAllExceptionHorarios().subscribe({
      next: (excepciones) => {
        this.exceptionHorarios = excepciones;
        console.log("✅ Excepciones de horario cargadas:", this.exceptionHorarios);
        this.verificarEstadoLocal(); // Asegurar que el estado se verifique tras cargar excepciones
      },
      error: (err) => {
        console.error("Error al cargar excepciones de horario:", err);
      }
    });
  }
  
  
  

  verificarEstadoLocal(): void {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    const diaSemana = ahora.getDay(); // 0 = Domingo, 6 = Sábado
    const fechaActual = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
  
    console.log(`Hora actual: ${horaActual}:${minutosActual} - Día: ${diaSemana}`);
    console.log(`Fecha actual: ${fechaActual}`);
    console.log("Excepciones registradas:", this.exceptionHorarios);
  
    // Resetear variables para mostrar en UI
    this.exceptionHoy = null;
    this.horarioHoy = null;
    this.proximaExcepcion = '';
  
    // 📌 Buscar si hay una excepción para hoy
    this.exceptionHoy = this.exceptionHorarios.find(exc => exc.fecha === fechaActual) || null;
  
    if (this.exceptionHoy) {
      console.log("⛔ Excepción encontrada:", this.exceptionHoy);
  
      // Si la excepción cierra todo el día, marcar cerrado y salir
      if (this.exceptionHoy.cierreTodoDia) {
        this.localAbierto = false;
        this.excepcionActiva = true;
        return;
      }
  
      const [horaAperturaExc, minutosAperturaExc] = this.exceptionHoy.horaApertura?.split(':').map(Number) || [];
      const [horaCierreExc, minutosCierreExc] = this.exceptionHoy.horaCierre?.split(':').map(Number) || [];
  
      if (horaAperturaExc !== undefined && horaCierreExc !== undefined) {
        const excepcionAbierta = (horaActual > horaAperturaExc || (horaActual === horaAperturaExc && minutosActual >= minutosAperturaExc)) &&
                                 (horaActual < horaCierreExc || (horaActual === horaCierreExc && minutosActual <= minutosCierreExc));
  
        // Si la excepción está activa, el local está cerrado por excepción
        if (excepcionAbierta) {
          this.localAbierto = false;
          this.excepcionActiva = true;
          return;
        }
  
        // Si la excepción aún no ha comenzado, la guardamos como próxima excepción
        if (horaActual < horaAperturaExc || (horaActual === horaAperturaExc && minutosActual < minutosAperturaExc)) {
          this.proximaExcepcion = `${this.exceptionHoy.horaApertura} - ${this.exceptionHoy.horaCierre}`;
        }
      }
    }
  
    console.warn("⚠️ No hay excepción activa, aplicando horario normal.");
  
    // 📌 Si no hay excepción activa, buscar el horario normal
    this.horarioHoy = this.horarios.find(horario => 
      (horario.tipoHorario.descripcion.toLowerCase() === "dias laborales" && diaSemana >= 1 && diaSemana <= 5) || 
      (horario.tipoHorario.descripcion.toLowerCase() === "fin de semana" && (diaSemana === 0 || diaSemana === 6))
    );
  
    if (!this.horarioHoy) {
      console.warn("⚠️ No se encontró un horario válido para hoy.");
      this.localAbierto = false;
      return;
    }
  
    console.log(`Horario normal: ${this.horarioHoy.tipoHorario.descripcion} - Apertura: ${this.horarioHoy.horaApertura} - Cierre: ${this.horarioHoy.horaCierre}`);
  
    const [horaApertura, minutosApertura] = this.horarioHoy.horaApertura.split(':').map(Number);
    const [horaCierre, minutosCierre] = this.horarioHoy.horaCierre.split(':').map(Number);
  
    this.localAbierto = (horaActual > horaApertura || (horaActual === horaApertura && minutosActual >= minutosApertura)) &&
                        (horaActual < horaCierre || (horaActual === horaCierre && minutosActual <= minutosCierre));
    
    // Si hay una excepción futura, se mantiene en `this.proximaExcepcion`
  }
  

  editarHorario(horario: Horario): void {
    this.horarioEditando = { ...horario };
    this.horarioForm = this.fb.group({
      horaApertura: [horario.horaApertura, Validators.required],
      horaCierre: [horario.horaCierre, Validators.required]
    });
  }

  guardarEdicion(): void {
  if (!this.horarioEditando || !this.horarioForm.valid) return;

  const horarioActualizado: Horario = {
    ...this.horarioEditando,
    horaApertura: this.horarioForm.value.horaApertura,
    horaCierre: this.horarioForm.value.horaCierre
  };

  this.horariosService.updateHorario(horarioActualizado).subscribe({
    next: (updatedHorario) => {
      this.horarios = this.horarios.map(h => h.id === updatedHorario.id ? updatedHorario : h);
      this.horarioEditando = null;
    },
    error: (error) => console.error('Error al actualizar horario:', error)
  });
  this.verificarEstadoLocal();
}


  cancelarEdicion(): void {
    this.horarioEditando = null;
  }

  crearExcepcion(): void {
    if (!this.exceptionForm.valid) {
      alert("Por favor, completa el formulario correctamente.");
      return;
    }
  
    const fechaSeleccionada = new Date(this.exceptionForm.value.fecha);
    const diaSemana = fechaSeleccionada.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  
    let horarioSeleccionado = this.horarios.find(horario => 
      (horario.tipoHorario.descripcion.toLowerCase() === "dias laborales" && diaSemana >= 1 && diaSemana <= 5) || 
      (horario.tipoHorario.descripcion.toLowerCase() === "fin de semana" && (diaSemana === 0 || diaSemana === 6))
    );
  
    if (!horarioSeleccionado) {
      alert("No se encontró un horario válido para esta fecha.");
      return;
    }
  
    const nuevaExcepcion: ExceptionHorario = {
      id: 0, 
      fecha: this.exceptionForm.value.fecha,
      horaApertura: this.exceptionForm.value.horaApertura || null,
      horaCierre: this.exceptionForm.value.horaCierre || null,
      cierreTodoDia: this.exceptionForm.value.cierreTodoDia,
      horario: horarioSeleccionado
    };
  
    this.horariosService.createExceptionHorario(nuevaExcepcion).subscribe({
      next: (excepcionGuardada) => {
        console.log("✅ Excepción guardada:", excepcionGuardada);
        this.exceptionForm.reset();
        alert("Excepción agregada correctamente.");
        this.cargarExcepciones(); // Refrescar la lista después de agregar
      },
      error: (err) => {
        console.error("Error al agregar excepción de horario:", err);
        alert("Hubo un problema al agregar la excepción.");
      }
    });
  }
  
  

  eliminarExcepcion(id: number): void {
    if (!confirm("¿Estás seguro de eliminar esta excepción de horario?")) {
      return;
    }
  
    this.horariosService.deleteExceptionHorario(id).subscribe({
      next: () => {
        this.exceptionHorarios = this.exceptionHorarios.filter(ex => ex.id !== id);
        this.verificarEstadoLocal(); // Volver a verificar si el local está abierto
        console.log("Excepción eliminada con éxito.");
      },
      error: (err) => {
        console.error("Error al eliminar excepción de horario:", err);
        alert("Hubo un error al eliminar la excepción.");
      }
    });
  }
  
  
}
