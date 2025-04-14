import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent  implements OnInit, OnDestroy {
  @Input() contactId: string = '';
  @Output() closeChat = new EventEmitter<void>();

  users$: Observable<any> | undefined;
  allUsers: any[] = [];
  messages: any[] = [];
  newMessage: string = '';
  userId: string = localStorage.getItem('userId') || '';
  filteredUsers: any[] = [];

  constructor(private chatService: ChatService, private userService: UserService) { }

  ngOnInit(): void {
    if (this.contactId) {
      this.fetchUsers();
      this.loadMessages();
      this.openChatWith(this.contactId);
    }

    // Suscribirse a nuevos mensajes
    this.chatService.onNuevoMensaje().subscribe(mensaje => {
      if ((mensaje.sender === this.contactId && mensaje.receiver === this.userId) ||
          (mensaje.sender === this.userId && mensaje.receiver === this.contactId)) {
        this.messages.push(mensaje);
        this.scrollToBottom();
      }
    });
  }

  // Cargar los mensajes previos
  loadMessages() {
    this.chatService.getMensajes(this.userId, this.contactId).subscribe(data => {
      this.messages = data;
      this.scrollToBottom();
    });
  }

  // Método para cargar los datos de los usuarios
  fetchUsers() {
    const loggedInUserId = localStorage.getItem('userId');

    this.users$ = this.userService.getUsers().pipe(
      map((users) => {
        const filteredUsers = users
          .filter(
            (user: { _id: string | null; rol: string }) =>
              user._id !== loggedInUserId 
          )
          .map((user: { profileImage: string; _id: any }) => {
            user.profileImage = this.userService.getProfileImageUrl(user._id);
            return user;
          });

        this.allUsers = filteredUsers;
        return filteredUsers;
      })
    );

    this.users$.subscribe((users) => {
      this.filteredUsers = users;
    });
  }

  // Buscar el usuario en la lista de usuarios filtrados
  getContact(contactId: string) {
    return this.filteredUsers.find(user => user._id === contactId);
  }

  // Enviar un mensaje
  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.enviarMensaje(this.userId, this.contactId, this.newMessage)
      .subscribe(() => {
        this.loadMessages(); 
        this.newMessage = '';
      });
  }

  // Unirse a la sala de chat
  openChatWith(contactId: string) {
    const roomId = `${this.userId}_${this.contactId}`;
    this.chatService.unirseSala(roomId);
    this.loadMessages();
  }
  
  // Desplazar el chat al fondo
  scrollToBottom() {
    setTimeout(() => {
      const el = document.getElementById('chat-container');
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  // Cerrar el chat
  cerrarChat() {
    this.closeChat.emit();
  }
  
  // Limpiar cuando el componente se destruye
  ngOnDestroy() {
    this.chatService.desconectar();
  }
  
}