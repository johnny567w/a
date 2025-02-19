import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarifa } from '../../../../models/tarifa.model';
import { TarifaService } from '../../../../core/services/tarifa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss'
})
export class TarifasComponent implements OnInit {
  tarifas: Tarifa[] = [];
  tarifaForm!: FormGroup;
  nuevaTarifaForm!: FormGroup;
  tarifaEditando: Tarifa | null = null;
  tarifaActiva: Tarifa | null = null;
  mensajeConfirmacion: string | null = null;


  constructor(
    private tarifaService: TarifaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarTarifas();
    this.inicializarFormularios();
  }

  cargarTarifas(): void {
    this.tarifaService.getAllTarifas().subscribe({
      next: (tarifas) => {
        this.tarifas = tarifas;
        this.obtenerTarifaActiva();
      },
      error: (error) => console.error('Error al cargar tarifas:', error)
    });
  }

  obtenerTarifaActiva(): void {
    this.tarifaService.getTarifaActiva().subscribe({
      next: (tarifa) => {
        this.tarifaActiva = tarifa;
      },
      error: () => console.warn('No hay una tarifa activa actualmente.')
    });
  }

  inicializarFormularios(): void {
    this.tarifaForm = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.nuevaTarifaForm = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  seleccionarTarifaParaEditar(tarifa: Tarifa): void {
    this.tarifaEditando = { ...tarifa };
    this.tarifaForm.patchValue({
      valor: tarifa.valor
    });
  }

  guardarTarifa(): void {
    if (!this.tarifaEditando) return;

    const nuevaTarifa = { ...this.tarifaEditando, valor: this.tarifaForm.value.valor };

    this.tarifaService.updateTarifa(nuevaTarifa).subscribe({
      next: (tarifaActualizada) => {
        this.tarifas = this.tarifas.map(t => t.id === tarifaActualizada.id ? tarifaActualizada : t);
        this.tarifaEditando = null;
        this.tarifaForm.reset();
      },
      error: (error) => console.error('Error al actualizar tarifa:', error)
    });
  }

  activarTarifa(id: number): void {
    this.tarifaService.activarTarifa(id).subscribe({
      next: (tarifa) => {
        this.tarifaActiva = tarifa;
        this.cargarTarifas();
      },
      error: (error) => console.error('Error al activar tarifa:', error)
    });
  }

  agregarTarifa(): void {
    if (this.nuevaTarifaForm.invalid) return;

    const nuevaTarifa: Tarifa = {
      id: 0,
      valor: this.nuevaTarifaForm.value.valor,
      activa: false
    };

    this.tarifaService.createTarifa(nuevaTarifa).subscribe({
      next: (tarifaCreada) => {
        this.tarifas.push(tarifaCreada);
        this.nuevaTarifaForm.reset();
      },
      error: (error) => console.error('Error al crear la tarifa:', error)
    });
  }

  eliminarTarifa(id: number): void {
    if (this.tarifaActiva?.id === id) {
      alert('No puedes eliminar la tarifa activa.');
      return;
    }
  
    this.tarifaService.deleteTarifa(id).subscribe({
      next: () => {
        this.tarifas = this.tarifas.filter(t => t.id !== id);
        console.log('Tarifa eliminada con éxito.');
      },
      error: (error) => console.error('Error al eliminar tarifa:', error)
    });
  }
  
}