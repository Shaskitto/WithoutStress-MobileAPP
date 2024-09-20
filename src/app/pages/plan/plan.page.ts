import { Component, OnInit } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit, ViewWillEnter {
  user$: Observable<any> | undefined;
  horarios: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.user$ = this.userService.getUser().pipe(
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
