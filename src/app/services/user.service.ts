import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método para obtener los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  // Método para obtener datos de un usuario
  getUser(): Observable<any>{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/user/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Metódo para actualizar información de un usuario
  updateUser(updateData: any): Observable<any>{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch(`${this.apiUrl}/user/${userId}`, updateData, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para obtener la imagen de perfil
  getProfileImageUrl(userId: string): string {
    return `${this.apiUrl}/user/${userId}/profile-image`;
  }

  // Método para enviar solicitud de amistad
  sendFriendRequest(friendId: string): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/friend/request/${userId}`, { friendId }, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  
  // Método para aceptar solicitud de amistad
  acceptFriendRequest(friendId: string): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/friend/request/accept/${userId}`, { friendId }, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
  // Método para eliminar solicitud de amistad
  declineFriendRequest(friendId: string): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/friend/request/decline/${userId}`, { friendId }, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
  // Método para obtener solicitudes 
  getPendingRequests(): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/friend/request/pending/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para obtener amigos
  getFriends(): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/friend/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para buscar amigos
  searchFriends(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/friend/search-friends/${username}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  } 

  // Método para eliminar un amigo
  deleteFriend(friendId: string): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/friend/${userId}`, { friendId }, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para crear notas
  createNote(noteData: { titulo: string; contenido: string; fecha: string; hora: string }): Observable<any> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/user/notes/${userId}`, noteData, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
  // Método para actulizar notas
  updateNote(noteId: string, noteData: { titulo?: string; contenido?: string; fecha?: string; hora?: string }): Observable<any> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch(`${this.apiUrl}/user/notes/${userId}/${noteId}`, noteData, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
  // Método para obtener las notas de un usuario
  getNotes(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/user/notes/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
  // Método para elminar notas
  deleteNote(noteId: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.apiUrl}/user/notes/${userId}/${noteId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }
  
}
