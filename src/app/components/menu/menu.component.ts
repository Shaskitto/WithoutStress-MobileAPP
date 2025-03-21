import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {
  currentRoute: string = '';

  constructor(private authService: AuthService, private router: Router, private menuCtrl: MenuController) { 
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {}

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
