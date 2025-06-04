import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  @Input() contactId: string = '';
  @Output() closeChat = new EventEmitter<void>();

  allUsers: any[] = [];
  filteredUsers: any[] = [];
  messages: any[] = [];
  newMessage: string = '';
  userId: string = localStorage.getItem('userId') || '';
  roomId: string = '';

  private messageSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    if (this.contactId) {
      this.fetchUsers();
      this.setupChat();
    }
  }

  fetchUsers() {
    const loggedInUserId = this.userId;

    this.userService.getUsers().subscribe((users: any[]) => {
      const filteredUsers = users
        .filter((user) => user._id !== loggedInUserId)
        .map((user) => {
          user.profileImage = this.userService.getProfileImageUrl(user._id);
          return user;
        });

      this.allUsers = filteredUsers;
      this.filteredUsers = filteredUsers;
    });
  }

  setupChat() {
    this.roomId = [this.userId, this.contactId].sort().join('_');

    // Ahora paso userId y roomId juntos
    this.socketService.connect(this.userId, this.roomId);

    // Cargar mensajes previos entre los dos usuarios
    this.chatService.getMensajes(this.userId, this.contactId).subscribe((msgs) => {
      this.messages = msgs;
      this.scrollToBottom();
  });


  // Suscríbete a nuevos mensajes
  this.messageSubscription = this.socketService.onNewMessage().subscribe((mensaje: any) => {
    if (mensaje.roomId === this.roomId) {
      this.messages.push(mensaje);
      this.scrollToBottom();
    }
  });

  this.messages = [];
}

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.socketService.sendMessage(
      this.roomId,
      this.userId,
      this.contactId,
      this.newMessage
    );

    this.newMessage = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.getElementById('chat-container');
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  cerrarChat() {
    this.closeChat.emit();
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
    this.socketService.disconnect();
  }

  getContact(contactId: string) {
    return this.filteredUsers.find((user) => user._id === contactId);
  }
}
