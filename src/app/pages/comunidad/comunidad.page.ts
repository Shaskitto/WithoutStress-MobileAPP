import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
})
export class ComunidadPage implements OnInit {
  private apiUrl = environment.apiUrl;
  users$: Observable<any> | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.users$ = this.authService.getUsers(); 
  }

}
