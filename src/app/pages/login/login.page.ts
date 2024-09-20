import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{
  email: string | undefined;
  password: string | undefined;
  rememberMe: boolean = false;
  user: any;
  forgotPasswordMode: boolean = false; 
  forgotPasswordEmail: string | undefined; 
  codeSent: boolean = false; 
  otp: string | undefined; 
  newPassword: string | undefined;
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { 
    this.loadEmail();
  }

  loadEmail() {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      this.email = storedEmail;
      this.rememberMe = true; 
    }
  }

  login() {
    const userData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(userData).subscribe(
      response => {
        console.log('Login exitoso:', response);
        this.saveEmail();
        this.loadUserData();
      },
      error => {
        console.error('Error de login:', error);
      }
    );
  }

  saveEmail() {
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email || '');
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }
  
  loadUserData() {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData; 
        this.navigate();
      }
    });
  }

  // Método para redirigir al home o evaluación inicial
  navigate(){
    if (!this.user || !this.user.semestre) {
      this.router.navigate(['/evaluacion']);
    } else {
      this.router.navigate(['/tabs/plan']);
    }
  }
  
  // Método para redirigir al registro
  navigateRegister(){
    this.router.navigate(['/registro'])
  }

  // Método para habilitar el modo de recuperación de contraseña
  navigateForgotPassword() {
    this.forgotPasswordMode = true;
    this.resetForgotPasswordFields();
  }

  // Método para restablecer campos de recuperación de contraseña
  resetForgotPasswordFields() {
    this.forgotPasswordEmail = undefined;
    this.codeSent = false; 
    this.otp = undefined;
    this.newPassword = undefined;
    this.isSubmitting = false; 
  }

  // Método para enviar el correo de recuperación
  submitForgotPassword() {
    if (this.forgotPasswordEmail) {
      const userData = { email: this.forgotPasswordEmail };
      this.isSubmitting = true; 
      this.authService.forgotPassword(userData).subscribe(
        response => {
          console.log('Correo de recuperación enviado:', response);
          this.codeSent = true; 
        },
        error => {
          console.error('Error al enviar correo de recuperación:', error);
          this.isSubmitting = false;
        }
      );
    }
  }

  // Método para restablecer la contraseña
  resetPassword() {
    const resetData = {
      email: this.forgotPasswordEmail,
      otp: this.otp,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(resetData).subscribe(
      response => {
        console.log('Contraseña restablecida:', response);
        this.forgotPasswordMode = false; 
        this.resetForgotPasswordFields();
      },
      error => {
        console.error('Error al restablecer la contraseña:', error);
      }
    );
  }
}