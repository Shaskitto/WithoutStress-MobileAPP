import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private router: Router) { }

  // Método para registrar un nuevo usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData);
  }

  // Método para iniciar sesión
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
      }),
    );
  }

  // Método para verificar user al restablecer contraseña 
  forgotPassword(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/forgot-password`, userData);
  }
  
  // Método para restablecer contraseña 
  resetPassword(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/forgot-password/reset`, userData);
  }

  // Método para validar username 
  checkUsernameExists(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/check-username`, { params: { username } });
  }

  // Método para validar correo
  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/check-email`, { params: { email } });
  }
  
  // Método para logout
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
