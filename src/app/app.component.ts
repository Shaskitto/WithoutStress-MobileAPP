import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSidebar = true;
  private pagesWithoutSidebar = [
    '/login',
    '/register',
    '/bienvenida',
    '/estado-de-animo',
    '/psicologo-tabs/dashboard',
    '/psicologo-tabs/chat',
    '/psicologo-tabs/perfil',
    '/mensaje',
  ];

  constructor(private router: Router, private platform: Platform) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !this.pagesWithoutSidebar.includes(this.router.url);
      }
    });

    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {});
    });
  }
}
