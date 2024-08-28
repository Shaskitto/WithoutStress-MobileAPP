import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.http.post(`${this.apiUrl}/api/user/register`, userData);
  }

  // Método para iniciar sesión
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/login`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);
      }),
    );
  }

  // Método para obtener los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/users/`);
  }

  // Método para obtener datos de un usuario
  getUser(): Observable<any>{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/api/user/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Metódo para actualizar información de un usuario
  updateUser(updateData: any): Observable<any>{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch(`${this.apiUrl}/api/user/${userId}`, updateData, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para logout
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
