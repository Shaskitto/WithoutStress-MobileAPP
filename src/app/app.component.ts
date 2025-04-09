import { Component } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSidebar = true;
  private pagesWithoutSidebar = ['/login', '/register', '/bienvenida', '/estado-de-animo', 'psicologo-dashboard'];

  constructor(private router: Router) {this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.showSidebar = !this.pagesWithoutSidebar.includes(this.router.url);
    }
  });
}
}