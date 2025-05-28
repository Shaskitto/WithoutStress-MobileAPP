import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject, tap } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private newMessageSubject = new Subject<any>(); 
  private roomSubject = new Subject<string>();    
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private socketService: SocketService) { }

  // Obtener los mensajes previos
  getMensajes(userId: string, contactId: string): Observable<any[]> {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/chat/${userId}/${contactId}`, { headers });
  }

  // Método para enviar un mensaje
  enviarMensaje(sender: string, receiver: string, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const roomId = `${sender}_${receiver}`;
    const mensaje = { sender, receiver, roomId, content };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/chat/${sender}/${receiver}`, mensaje, { headers }).pipe(
      tap(() => {
        this.socketService.emit('enviarMensaje', mensaje);
      })
    );
  }

  // Escuchar nuevos mensajes del socket
  onNuevoMensaje(): Observable<any> {
    return this.socketService.listen('new-message').pipe(  
      tap((mensaje) => {
        this.newMessageSubject.next(mensaje);
      })
    );
  }

  // Suscribirse a la sala de chat
  unirseSala(roomId: string): void {
    this.socketService.emit('join-room', { roomId });
    this.roomSubject.next(roomId);
  }

  // Obtener el observable de la nueva notificación de mensaje
  getNuevoMensajeObservable(): Observable<any> {
    return this.newMessageSubject.asObservable();
  }

  // Obtener la sala activa en el chat
  getSalaActiva(): Observable<string> {
    return this.roomSubject.asObservable();
  }

  // Método para desconectar del socket
  desconectar(): void {
    this.socketService.disconnect(); 
  }
}
