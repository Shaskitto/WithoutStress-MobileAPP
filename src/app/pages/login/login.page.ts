import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) { 
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
    this.authService.getUser().subscribe({
      next: (userData) => {
        this.user = userData; 
        this.navigate();
      }
    });
  }

  navigate(){
    if (!this.user || !this.user.semestre) {
      this.router.navigate(['/evaluacion']);
    } else {
      this.router.navigate(['/tabs/plan']);
    }
  }
  
  navigateRegister(){
    this.router.navigate(['/registro'])
  }

  navigateForgotPassword(){
    
  }
}
