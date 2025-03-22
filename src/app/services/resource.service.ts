import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ResourceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para obtener recursos por id
  getResource(resourceId: string): Observable<any>{
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/resource/${resourceId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para obtener el contenido de un recurso por id
  getContent(resourceId: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/resource/${resourceId}/contenido`, { headers, responseType: 'blob' });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para obtener recursos por categoría
  getByCategory(categoria: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/resource/categoria/${categoria}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
}