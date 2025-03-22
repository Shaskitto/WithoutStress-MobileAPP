import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {
  user: any
  currentRoute: string = '';
  isDarkMode = false;
  apiUrl = environment.apiUrl;

  constructor(private authService: AuthService, private userService: UserService,private router: Router) { 
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData; 

        const userId = localStorage.getItem('userId');
        if (userId && this.user.profileImage) {
          const timestamp = new Date().getTime();
          this.user.profileImage = this.userService.getProfileImageUrl(userId) + '?t=' + timestamp;
        }
      }
    });
  }

  // Cerrar Sidebar automáticamente
  closeMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).close();
    }
  }

  // Cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }  
}