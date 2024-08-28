import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage{
  user = { 
    username: '', 
    email: '', 
    password: '' 
  };

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.registerUser(this.user).subscribe(
      response => {
        console.log('Usuario registrado con éxito:', response);
        this.navigateLogin();
      },
      error => {
        console.error('Error al registrar el usuario:', error);
      }
    );
  }

  navigateLogin(){
    this.router.navigate(['/login'])
  }
}
