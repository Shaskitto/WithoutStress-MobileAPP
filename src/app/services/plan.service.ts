import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = environment.apiUrl;
  private planSubject = new BehaviorSubject<any>(null);  // Usamos un BehaviorSubject para almacenar el plan
  plan$ = this.planSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  // Método para generar un plan 
  generarPlan(estadoDeAnimo: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const body = { estadoDeAnimo };
      return this.http.post(`${this.apiUrl}/plan/generar`, body, { headers }).pipe(
        tap(plan => {
          this.planSubject.next(plan); // Emitimos el nuevo plan cuando se genera
        })
      );
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