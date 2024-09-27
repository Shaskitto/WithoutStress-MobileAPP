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
    return this.http.get(`${this.apiUrl}/api/users/`);
  }

  // Método para obtener datos de un usuario
  getUser(): Observable<any>{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/api/user/${userId}`, { headers });
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
      return this.http.patch(`${this.apiUrl}/api/user/${userId}`, updateData, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para enviar solicitud de amistad
  sendFriendRequest(friendId: string): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/api/friend/request/${userId}`, { friendId }, { headers });
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
      return this.http.post(`${this.apiUrl}/api/friend/request/accept/${userId}`, { friendId }, { headers });
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
      return this.http.post(`${this.apiUrl}/api/friend/request/decline/${userId}`, { friendId }, { headers });
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
      return this.http.get(`${this.apiUrl}/api/friend/request/pending/${userId}`, { headers });
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
      return this.http.get(`${this.apiUrl}/api/friend/${userId}`, { headers });
    } else {
      throw new Error('Token no encontrado');
    }
  }

  // Método para buscar amigos
  searchFriends(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.apiUrl}/api/friend/search-friends/${username}`, { headers });
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
      // Enviamos friendId en el cuerpo de la solicitud
      return this.http.delete(`${this.apiUrl}/api/friend/${userId}`, { headers, body: { friendId } });
    } else {
      throw new Error('Token no encontrado');
    }
  }
}
