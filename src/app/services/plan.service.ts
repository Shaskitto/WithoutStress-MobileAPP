import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para generar un plan 
  generarPlan(estadoDeAnimo?: string): Observable<any> {
    const token = localStorage.getItem('token'); 

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
      const body = estadoDeAnimo ? { estadoDeAnimo } : {}; 
      return this.http.post(`${this.apiUrl}/plan/generar`, body, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para obtener el plan de un usuario 
  obtenerPlan(userId: string): Observable<any> {
    const token = localStorage.getItem('token'); 
  
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/plan/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
}