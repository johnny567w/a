import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule,FooterComponent,NavbarComponent],
})
export class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  mensajeError: string | null = null;

  form = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  esRequerido(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.hasError('required') && control.touched : false;
  }

  esEmailValido(): boolean {
    const control = this.form.get('email');
    return control ? control.hasError('email') && control.touched : false;
  }

  esPasswordValida(): boolean {
    const control = this.form.get('password');
    return control ? control.hasError('minlength') && control.touched : false;
  }
  async iniciarSesion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    try {
      const response = await this._authService.login({ correo: email!, password: password! }).toPromise();

      if (!response || !response.token) {
        throw new Error('Error en la autenticación. No se recibió un token.');
      }

      if (response.role === 'Cajero') {
        this._router.navigate(['/dashboard-cajero']);
      } else {
        this._router.navigate(['/dashboard-usuario']);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.mensajeError = 'Correo o contraseña incorrectos';
      setTimeout(() => (this.mensajeError = null), 5000);
    }
  }
  async signInGoogle() {
    console.log('Iniciar sesión con Google (por implementar)');
  }
  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 5000);
  }
}
