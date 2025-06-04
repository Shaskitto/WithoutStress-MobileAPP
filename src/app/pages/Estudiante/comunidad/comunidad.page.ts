import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { DiarioBotService } from 'src/app/services/diario-bot.service';
import { FriendsService } from 'src/app/services/friends.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
})
export class ComunidadPage implements OnInit {
  private apiUrl = environment.apiUrl;
  users$: Observable<any> | undefined;
  friends: any[] = [];
  psicologos: any[] = [];
  activeSection: string = 'friendsList';
  pendingRequests: any[] = [];
  searchTerm: string = '';
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  manageFriends: boolean = false;
  chatOpen = false;
  selectedContactId: string = '';
  textoDiario = '';
  resultadoDiario: any = null;
  errorDiario: string | null = null;
  cargandoDiario = false;
  public libroAbierto = false;

  constructor(
    private userService: UserService,
    private friendsService: FriendsService,
    private alertController: AlertController,
    private diariobotService: DiarioBotService
  ) {}

  // Cargar los datos de los usuarios cuando se inicializa el componente
  ngOnInit() {
    this.fetchUsers();
    this.fetchPsicologos();
  }

  // Cargar los datos de los usuarios cada vez que la vista vuelve a ser visible
  ionViewWillEnter() {
    this.resetSearchTerm();
    this.fetchUsers();
    this.fetchPendingRequests();
    this.fetchFriends();
  }

  // Método para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  // Método para alternar (activar o desactivar) el modo de gestionar de amigos
  toggleManageFriends() {
    this.manageFriends = !this.manageFriends;
  }

  // Método para establecer la sección activa (Por defecto lista de amigos)
  setActiveSection(section: string) {
    this.activeSection = section;
  }

  // Método para reiniciar el término de búsqueda y mostrar todos los usuarios
  resetSearchTerm() {
    this.searchTerm = '';
    this.filteredUsers = [...this.allUsers];
  }

  // Método para cargar los datos de los usuarios
  fetchUsers() {
    const loggedInUserId = localStorage.getItem('userId');

    this.users$ = this.userService.getUsers().pipe(
      map((users) => {
        const filteredUsers = users
          .filter(
            (user: { _id: string | null; rol: string }) =>
              user._id !== loggedInUserId && user.rol !== 'Psicologo'
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

  // Método para cargar los psicologos
  fetchPsicologos() {
    this.userService.getUsers().subscribe((users) => {
      const psicologosFiltrados = users
        .filter((user: { rol: string }) => user.rol === 'Psicologo')
        .map((user: { profileImage: string; _id: any }) => {
          user.profileImage = this.userService.getProfileImageUrl(user._id);
          return user;
        });

      this.psicologos = psicologosFiltrados;
    });
  }

  // Método para buscar usuarios por username
  searchFriends() {
    const term = this.searchTerm.toLowerCase();
    if (term === '') {
      this.filteredUsers = [...this.allUsers];
    } else {
      this.filteredUsers = this.allUsers.filter((user) =>
        user.username.toLowerCase().includes(term)
      );
    }
  }

  // Método para carga los datos de los usuarios amigos ('accepted')
  fetchFriends() {
    this.friendsService.getFriends().subscribe((friends) => {
      this.friends = friends.map(
        (friend: { friendId: { _id: any; profileImage: string } }) => {
          const userId = friend.friendId._id;
          friend.friendId.profileImage =
            this.userService.getProfileImageUrl(userId);
          return friend;
        }
      );
    });
  }

  // Método para carga los datos de los usuarios en solicitud ('pending')
  fetchPendingRequests() {
    this.friendsService.getPendingRequests().subscribe((requests) => {
      this.pendingRequests = requests.map(
        (request: { friendId: { _id: any; profileImage: string } }) => {
          const userId = request.friendId._id;
          request.friendId.profileImage =
            this.userService.getProfileImageUrl(userId);
          return request;
        }
      );
    });
  }

  // Método para enviar solicitud a un usuario
  sendFriendRequest(friendId: string): void {
    this.friendsService.sendFriendRequest(friendId).subscribe(
      async (response) => {
        await this.showAlert(
          'Solicitud de amistad enviada',
          'La solicitud de amistad se ha enviado correctamente.'
        );
        this.fetchPendingRequests();
      },
      async (error) => {
        await this.showAlert(
          'Alerta',
          'Ya has enviado una solicitud de amistad a este usuario.'
        );
      }
    );
  }

  // Método para aceptar solicitud de un usuario
  acceptFriendRequest(friendId: string): void {
    this.friendsService.acceptFriendRequest(friendId).subscribe(
      (response) => {
        this.fetchPendingRequests();
        this.fetchFriends();
        this.setActiveSection('friendsList');
      },
      (error) => {}
    );
  }

  // Método para rechazar solicitud de un usuario
  declineFriendRequest(friendId: string): void {
    this.friendsService.declineFriendRequest(friendId).subscribe(
      (response) => {
        this.fetchPendingRequests();
      },
      (error) => {}
    );
  }

  // Método para eliminar un amigo del usuario
  deleteFriend(friendId: string) {
    this.friendsService.deleteFriend(friendId).subscribe(
      (response) => {
        this.fetchFriends();
      },
      (error) => {}
    );
  }

  goToChat(contactId: string) {
    this.selectedContactId = contactId;
    this.chatOpen = true;
  }

  analizarDiario() {
    this.errorDiario = null;
    this.resultadoDiario = null;

    if (!this.textoDiario.trim()) {
      this.errorDiario = 'Por favor escribe algo en tu diario';
      return;
    }

    this.cargandoDiario = true;
    this.diariobotService.analizarTexto(this.textoDiario).subscribe({
      next: (res) => {
        if (res.error) {
          this.errorDiario = res.error;
          this.libroAbierto = false;
        } else {
          this.resultadoDiario = res;
          this.libroAbierto = true; 
        }
        this.cargandoDiario = false;
      },
      error: () => {
        this.errorDiario = 'Error al comunicarse con la API';
        this.cargandoDiario = false;
        this.libroAbierto = false;
      },
    });
  }

  cerrarLibro() {
    this.libroAbierto = false;
    this.textoDiario = '';
    this.resultadoDiario = null;
    this.errorDiario = null;
  }
}
