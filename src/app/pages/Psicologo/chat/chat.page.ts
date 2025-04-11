import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  estudiantes: any[] = [];

  constructor(private userService: UserService) { }

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

  goToChat(friendId: string) {
    console.log('Enviando al chat');
  }

}
