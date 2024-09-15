import { Component, OnInit } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit, ViewWillEnter {
  user$: Observable<any> | undefined;
  horarios: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.user$ = this.authService.getUser().pipe(
      catchError(error => {
        console.error('Error al obtener los datos del usuario', error);
        return [];
      })
    );

    this.user$.subscribe(data => {
      this.horarios = data.horario; 
    });
  }

}
