import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private apiUrl = environment.apiUrl;

  constructor() { 
    this.socket = io(this.apiUrl);
  }

  // Método para escuchar eventos
  listen(eventName: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
  }

  // Método para emitir eventos
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Método para desconectar el socket cuando ya no se necesita
  disconnect(): void {
    this.socket.disconnect();
  }
}
