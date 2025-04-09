import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
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
  isLoading = true;

  constructor(private userService: UserService) { }

  // Cargar los datos del usuario cuando se inicializa el componente
  ngOnInit() {
    this.loadUserData();
  }

  // Cargar los datos del usuario cada vez que la vista vuelve a ser visible
  ionViewWillEnter() {
    this.isLoading = true;
    this.loadUserData();
  }

  // Método para cargar los horarios del usuario 
  loadUserData() {
    this.user$ = this.userService.getUser().pipe(
      catchError(error => {
        console.error('Error al obtener los datos del usuario', error);
        return of([]);
      })
    );

    this.user$.subscribe(data => {
      this.horarios = data.horario; 
      this.isLoading = false; 
    });
  }
}