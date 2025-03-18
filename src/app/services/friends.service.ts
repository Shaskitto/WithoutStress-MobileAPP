import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
}