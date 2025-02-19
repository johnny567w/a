import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule,NavbarComponent,FooterComponent],
})
export class RegisterComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  mensaje: string | null = null;
  exito: boolean = false;

  form = this._formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Exactamente 10 dígitos
    fechaNacimiento: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]], // Solo letras y espacios
    genero: ['', [Validators.required]],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.value;
    const generoChar = formValues.genero === 'masculino' ? 'M' : 'F';

    const usuarioData = {
      nombre: formValues.nombre!,
      apellido: formValues.apellido!,
      cedula: formValues.cedula!,
      correo: formValues.email!,
      password: formValues.password!,
      fechaNacimiento: formValues.fechaNacimiento!,
      telefono: formValues.telefono!,
      direccion: formValues.direccion!,
      estado: 'Activo',
      genero: generoChar,
      rol: { id: 2, nombre: 'Usuario' },
    };

    try {
      const response = await this._authService.register(usuarioData).toPromise();

      if (!response) {
        throw new Error('Error al registrar el usuario.');
      }

      const loginResponse = await this._authService.login({
        correo: usuarioData.correo,
        password: formValues.password!,
      }).toPromise();

      this.mensaje = 'Cuenta creada con éxito. ¡Bienvenido!';
      this.exito = true;
      this.form.reset();

      if (loginResponse.role === 'Cajero') {
        this._router.navigate(['/dashboard-cajero']);
      } else {
        this._router.navigate(['/dashboard-usuario']);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      this.mensaje = 'Hubo un problema al crear tu cuenta. Intenta nuevamente.';
      this.exito = false;
    }
  }
  async signInGoogle() {
    console.log('Registrarse con Google (por implementar)');
  }
  
  esRequerido(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.hasError('required') && control.touched;
  }
  
  esCedulaValida(): boolean {
    const control = this.form.get('cedula');
    return !!control && control.hasError('pattern') && control.touched;
  }
  
  esFechaNacimientoValida(): boolean {
    const control = this.form.get('fechaNacimiento');
    return !!control && control.hasError('fechaInvalida') && control.touched;
  }
  
  esDireccionValida(): boolean {
    const control = this.form.get('direccion');
    return !!control && control.hasError('pattern') && control.touched;
  }
  
  esEmailValido(): boolean {
    const control = this.form.get('email');
    return !!control && control.hasError('email') && control.touched;
  }
  
  esPasswordValida(): boolean {
    const control = this.form.get('password');
    return !!control && control.hasError('minlength') && control.touched;
  }
}
