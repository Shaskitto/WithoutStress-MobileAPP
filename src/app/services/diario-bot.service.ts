import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface AnalizarRespuesta {
  estado: string;
  respuesta: string;
  actividad: string;
  error?: string;
  raw?: any;
}

export interface EntradaDiario {
  _id: string;
  texto: string;
  respuesta: string;
  fecha: string;
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiarioBotService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  analizarTexto(texto: string): Observable<AnalizarRespuesta> {
    const userId = localStorage.getItem('userId');

    const url = `${this.apiUrl}/diario/analizar`;
    return this.http.post<AnalizarRespuesta>(url, { texto, userId  });
  }

  obtenerEntradas(): Observable<EntradaDiario[]> {
    const userId = localStorage.getItem('userId');

    const url = `${this.apiUrl}/diario/${userId}`;
    return this.http.get<EntradaDiario[]>(url);
  }
}
