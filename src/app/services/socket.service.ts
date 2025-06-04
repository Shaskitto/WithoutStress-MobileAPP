import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  private apiUrl = environment.apiUrl;

  constructor() {}

  connect(userId: string, roomId: string) {
  this.socket = io(this.apiUrl);

  this.socket.on('connect', () => {
    console.log('✅ Conectado al servidor Socket.IO');

    // Únete a la sala de chat (roomId)
    this.socket?.emit('join-room', { roomId });
    console.log('🟢 Usuario unido a la sala:', roomId);
  });

  this.socket.on('disconnect', () => {
    console.log('⚠️ Desconectado del servidor Socket.IO');
  });
}


  sendMessage(roomId: string, sender: string, receiver: string, content: string) {
    if (!this.socket) return;

    console.log(`Enviando mensaje a la sala ${roomId}`, { sender, receiver, content });
    this.socket.emit('send-message', {
      roomId,
      sender,
      receiver,
      content
    });
  }
  
  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      if (!this.socket) return;

      this.socket.on('new-message', (message: any) => {
        observer.next(message);
      });

      // Limpieza al cerrar suscripción
      return () => {
        this.socket?.off('new-message');
      };
    });
  }

  // Método para desconectar el socket cuando ya no se necesita
  disconnect() {
    this.socket?.disconnect();
  }
}
