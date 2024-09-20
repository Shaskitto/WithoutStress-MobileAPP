import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{
  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  forgotPasswordMode: boolean = false; 
  codeSent: boolean = false; 
  isSubmitting: boolean = false;
  email: string = ''; 
  errorMessage: string = ''; 
  rememberMe: boolean = false;
  user: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router) { 
    this.initializeForms();

    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = ''; 
    });

    this.authService.getLogoutObservable().subscribe(() => {
      this.loginForm.reset(); 
      this.loginForm.updateValueAndValidity(); 
      this.initializeForms();
    });
  }

  initializeForms() {
    const savedEmail = localStorage.getItem('rememberedEmail') || '';
    this.loginForm = this.fb.group({
      email: [savedEmail, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.forgotPasswordForm = this.fb.group({
      forgotPasswordEmail: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return; 
    }
  
    this.isSubmitting = true; 
    const userData = this.loginForm.value;
  
    this.authService.login(userData).subscribe(
      response => {
        console.log('Login exitoso:', response);
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.loginForm.value.email); 
        } else {
          localStorage.removeItem('rememberedEmail'); 
        }
        this.loadUserData();
      },
      error => {
        console.error('Error de login:', error);
        this.isSubmitting = false; 
        
        if (error.status === 400 || error.status === 404) { 
          this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.'; 
        } 
      }
    );
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

  // Método para reiniciar los campos del formulario de recuperación de contraseña
  resetForgotPasswordFields() {
    this.forgotPasswordForm.reset();
    this.codeSent = false;
    this.isSubmitting = false;
  }
  
  // Método para habilitar el modo de recuperación de contraseña
  navigateForgotPassword() {
    this.forgotPasswordMode = true;
    this.resetForgotPasswordFields();
  }

  // Método para enviar el correo de recuperación
  submitForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const userData = { email: this.forgotPasswordForm.value.forgotPasswordEmail };
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

  // Método para restablecer la contraseña
  resetPassword() {
    if (this.forgotPasswordForm.invalid) {
      return; 
    }

    const resetData = this.forgotPasswordForm.value;
    this.authService.resetPassword(resetData).subscribe(
      response => {
        console.log('Contraseña restablecida:', response);
        this.resetForgotPasswordFields();
      },
      error => {
        console.error('Error al restablecer la contraseña:', error);
      }
    );
  }
}