import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registerForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  // Cargar el formulario cuando se inicializa el componente
  ngOnInit() {
    this.initializeForm(); 
  }

  // Cargar el formulario cada vez que la vista vuelve a ser visible
  ionViewWillEnter() {
    this.registerForm.reset(); 
  }

  // Inicializa el formulario de registro
  initializeForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required], [this.usernameTakenValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email], [this.emailTakenValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }  

  // Validación personalizada para el nombre de usuario
  usernameTakenValidator(control: AbstractControl): Promise<{ [key: string]: any } | null> {
    return new Promise((resolve) => {
      this.authService.checkUsernameExists(control.value).subscribe(isTaken => {
        resolve(isTaken ? { usernameTaken: true } : null);
      });
    });
  }

  // Validación personalizada para el correo electrónico
  emailTakenValidator(control: AbstractControl): Promise<{ [key: string]: any } | null> {
    return new Promise((resolve) => {
      this.authService.checkEmailExists(control.value).subscribe(isTaken => {
        resolve(isTaken ? { emailTaken: true } : null);
      });
    });
  }

  // Método para registrar un usuario
  register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.registerUser(this.registerForm.value).subscribe(
      response => {
        console.log('Usuario registrado con éxito:', response);
        this.navigateLogin();
      },
      error => {
        console.error('Error al registrar el usuario:', error);
      }
    );
  }

  // Navegar al login
  navigateLogin(){
    this.router.navigate(['/login'])
  }
}