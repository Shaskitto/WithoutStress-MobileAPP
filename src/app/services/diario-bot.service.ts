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

@Injectable({
  providedIn: 'root',
})
export class DiarioBotService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  analizarTexto(texto: string): Observable<AnalizarRespuesta> {
    // Usa la URL completa del endpoint
    const url = `${this.apiUrl}/diario/analizar`; 
    return this.http.post<AnalizarRespuesta>(url, { texto });
  }
}
