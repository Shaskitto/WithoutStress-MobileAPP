import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

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
  successMessage: string = '';  
  rememberMe: boolean = true;
  user: any;
  forgotPasswordEmail: string | undefined; 
  otp: string | undefined; 
  newPassword: string | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router, private alertController: AlertController) { 
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
  }

  // Método para iniciar sesión
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
  
  // Método para cargar los datos del usuario
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
    this.errorMessage = ''; 
    this.successMessage = ''; 
  }
  
  // Método para solicitar restablecer la contraseña
  submitForgotPassword() {
    this.errorMessage = '';
    this.successMessage = ''; 

    if (!this.forgotPasswordEmail) {
      this.errorMessage = 'Por favor, ingresa tu correo electrónico.';
      return;
    }

    const normalizedEmail = this.forgotPasswordEmail.toLowerCase();
    this.isSubmitting = true; 

    this.authService.checkEmailExists(normalizedEmail).subscribe(
      (exists) => {
          if (exists) {
              const userData = { email: normalizedEmail };

              this.authService.forgotPassword(userData).subscribe(
                  (response) => {
                      console.log('Correo de recuperación enviado:', response);
                      this.codeSent = true; 
                      this.successMessage = 'Se ha enviado un código de verificación a tu correo electrónico.';
                      this.isSubmitting = false; 
                  }
              );
          } else {
              this.isSubmitting = false; 
              this.errorMessage = 'Correo electrónico de usuario no encontrado.';
          }
      }
    );
  }

  // Método para restablecer la contraseña
  resetPassword() {
    this.errorMessage = '';
  
    if (!this.otp || !this.newPassword) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }
  
    if (this.newPassword.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }
  
    const resetData = {
      email: this.forgotPasswordEmail,
      otp: this.otp,
      newPassword: this.newPassword
    };
  
    this.authService.resetPassword(resetData).subscribe(
      async response => {
        console.log('Contraseña restablecida:', response);
        this.forgotPasswordMode = false; 
        this.resetForgotPasswordFields();

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Contraseña restablecida exitosamente.',
          buttons: ['OK']
        });
  
        await alert.present();
  
      },
      error => {
        console.error('Error al restablecer la contraseña:', error);
      }
    );
  }  
}