import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userIdSubject = new BehaviorSubject<string | null>(null);
  private logoutSubject = new Subject<void>();

  constructor(private http: HttpClient) {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userIdSubject.next(storedUserId);
    } else {
    }
  }

  //Método para obtener frase del día
  getDailyPhrase() {
    return this.http.get(`${this.apiUrl}/auth/api/phrase`);
  }

  // Método para registrar un nuevo usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Método para iniciar sesión
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
        this.userIdSubject.next(response.userId);
      })
    );
  }

  // Método para obtener el usuario actual (si está autenticado)
  getCurrentUser(): Observable<any> {
    return this.userIdSubject.asObservable();
  }

  // Método para verificar user al restablecer contraseña
  forgotPassword(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, userData);
  }

  // Método para restablecer contraseña
  resetPassword(userData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/forgot-password/reset`,
      userData
    );
  }

  // Método para validar username
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.apiUrl}/auth/check-username`, {
        params: { username },
      })
      .pipe(map((response) => response.exists));
  }

  // Método para validar correo
  checkEmailExists(email: string): Observable<any> {
    return this.http
      .get<{ exists: boolean }>(`${this.apiUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((response) => response.exists));
  }

  // Método para logout
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.userIdSubject.next(null);
    this.logoutSubject.next();
  }

  getLogoutObservable(): Observable<void> {
    return this.logoutSubject.asObservable();
  }
}
