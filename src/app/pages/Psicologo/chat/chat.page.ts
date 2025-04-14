import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  estudiantes: any[] = [];
  chatOpen = false;
  selectedContactId: string = '';

  constructor(private userService: UserService, private renderer: Renderer2) { }

  ngOnInit() {
    this.fetchEstudiantes();
  }

  // Método para cargar los estudiantes
  fetchEstudiantes() {
    this.userService.getUsers().subscribe((users) => {
      const estudiantesFiltrados = users
        .filter((user: { rol: string }) => user.rol === 'Estudiante')
        .map((user: { profileImage: string; _id: any }) => {
          user.profileImage = this.userService.getProfileImageUrl(user._id);
          return user;
        });
  
      this.estudiantes = estudiantesFiltrados;
    });
  }

  goToChat(contactId: string) {
    this.selectedContactId = contactId;
    this.chatOpen = true;
    this.renderer.addClass(document.body, 'tabs-hidden');
  }

  closeChat() {
    this.chatOpen = false;
    this.renderer.removeClass(document.body, 'tabs-hidden'); 
  }
}
