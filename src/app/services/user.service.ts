import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
}
