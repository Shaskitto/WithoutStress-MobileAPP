import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private logoutSubject = new Subject<void>();
  
  constructor(private http: HttpClient) { }

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
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/api/auth/check-username`, { params: { username } })
        .pipe(map(response => response.exists)); 
  }


  // Método para validar correo
  checkEmailExists(email: string): Observable<any> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/api/auth/check-email`, { params: { email } })
    .pipe(map(response => response.exists)); 
  }
  
  // Método para logout
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.logoutSubject.next();
  }

  getLogoutObservable(): Observable<void> {
    return this.logoutSubject.asObservable();
  }
}
