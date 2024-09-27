import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
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
  activeSection: string = 'friendsList';
  pendingRequests: any[] = [];
  searchTerm: string = ''; 
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  manageFriends: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fetchUsers();
  }

  ionViewWillEnter() {
    this.resetSearchTerm(); 
    this.fetchUsers();
    this.fetchPendingRequests(); 
    this.fetchFriends();
  }

  toggleManageFriends() {
    this.manageFriends = !this.manageFriends;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  resetSearchTerm() {
    this.searchTerm = ''; 
    this.filteredUsers = [...this.allUsers]; 
  }

  fetchUsers() {
    const loggedInUserId = localStorage.getItem('userId');

    this.users$ = this.userService.getUsers().pipe(
      map(users => {
        const filteredUsers = users.filter((user: { _id: string | null; }) => user._id !== loggedInUserId);
        this.allUsers = filteredUsers; 
        return filteredUsers; 
      })
    );

    this.users$.subscribe(users => {
      this.filteredUsers = users; 
    });
  }

  searchFriends() {
    const term = this.searchTerm.toLowerCase();
    if (term === '') {
      this.filteredUsers = [...this.allUsers];
    } else {  
      this.filteredUsers = this.allUsers.filter(user => user.username.toLowerCase().includes(term));
    }
  }

  fetchFriends() {
    this.userService.getFriends().subscribe(friends => {
      this.friends = friends.map((friend: { friendId: { _id: any; profileImage: string; }; }) => {
        const userId = friend.friendId._id;
        const timestamp = new Date().getTime();
        friend.friendId.profileImage = `${this.apiUrl}/api/user/${userId}/profile-image?t=${timestamp}`;
        return friend;
      });
      console.log('Amigos recibidos:', this.friends);
    });
  }

  fetchPendingRequests() {
    this.userService.getPendingRequests().subscribe(requests => {
      this.pendingRequests = requests.map((request: { friendId: { _id: any; profileImage: string; }; }) => {
        const userId = request.friendId._id;
        const timestamp = new Date().getTime(); 
        request.friendId.profileImage = `${this.apiUrl}/api/user/${userId}/profile-image?t=${timestamp}`;
        return request;
      });
      console.log('Solicitudes pendientes recibidas:', this.pendingRequests);
    });
  }
  
  sendFriendRequest(friendId: string): void {
    this.userService.sendFriendRequest(friendId).subscribe(
      (response) => {
        console.log('Solicitud de amistad enviada:', response);
        this.fetchPendingRequests();
      },
      (error) => {
        console.error('Error al enviar solicitud de amistad:', error);
      }
    );
  }

  acceptFriendRequest(friendId: string): void {
    this.userService.acceptFriendRequest(friendId).subscribe(
      (response) => {
        console.log('Solicitud de amistad aceptada:', response);
        this.fetchPendingRequests(); 
        this.fetchFriends(); 
      },
      (error) => {
        console.error('Error al aceptar la solicitud de amistad:', error);
      }
    );
  }

  declineFriendRequest(friendId: string): void {
    this.userService.declineFriendRequest(friendId).subscribe(
      (response) => {
        console.log('Solicitud de amistad rechazada:', response);
        this.fetchPendingRequests(); 
      },
      (error) => {
        console.error('Error al rechazar la solicitud de amistad:', error);
      }
    );
  }

  deleteFriend(friendId: string) {
    this.userService.deleteFriend(friendId).subscribe(
      response => {
        console.log('Amigo eliminado:', response);
        this.fetchFriends(); 
      },
      error => {
        console.error('Error al eliminar amigo:', error);
      }
    );
  }

  goToChat(friendId: string) {
    console.log("Enviando al chat del amigo")
  }

}