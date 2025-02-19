import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario.model';
import { Cajero } from '../../../../models/cajero.model';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { CajerosService } from '../../../../core/services/cajeros.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cajeros: Cajero[] = [];
  mensaje: string = '';
  mensajeClase: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private cajerosService: CajerosService,
    private fb: FormBuilder
  ) {}

  usuarioEditando: Usuario | null = null;
  usuarioEditForm!: FormGroup;

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCajeros();
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.usuarioEditForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      estado: ['', Validators.required],
      genero: ['', Validators.required]
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditando = { ...usuario };
    this.usuarioEditForm.patchValue({
      nombre: usuario.persona.nombre,
      apellido: usuario.persona.apellido,
      correo: usuario.persona.correo,
      telefono: usuario.persona.telefono,
      direccion: usuario.persona.direccion,
      estado: usuario.persona.estado,
      genero: usuario.persona.genero
    });
  }


  cancelarEdicion(): void {
    this.usuarioEditando = null;
  }


  cargarUsuarios(): void {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: () => {
        this.mostrarMensaje("Error al cargar usuarios.", 'error');
      }
    });
  }

  cargarCajeros(): void {
    this.cajerosService.getAllCajeros().subscribe({
      next: (cajeros) => {
        this.cajeros = cajeros;
      },
      error: () => {
        this.mostrarMensaje("Error al cargar cajeros.", 'error');
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
}