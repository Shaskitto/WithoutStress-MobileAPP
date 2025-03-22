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
  moodRegisteredToday = false;

  constructor(private userService: UserService) { }

  // Cargar los datos del usuario cuando se inicializa el componente
  ngOnInit() {
    this.loadUserData();
  }

  // Cargar los datos del usuario cada vez que la vista vuelve a ser visible
  ionViewWillEnter() {
    this.loadUserData();
  }

  // Método para cargar los horarios del usuario 
  loadUserData() {
    this.isLoading = true;

    this.user$ = this.userService.getUser().pipe(
      catchError(error => {
        console.error('Error al obtener los datos del usuario', error);
        return of(null); 
      })
    );

    this.user$.subscribe(data => {
      if (data) {
        this.horarios = data.horario;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.moodRegisteredToday = data.estadoDeAnimo?.some((entry: any) => {
          const entryDate = new Date(entry.fecha);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });
      }

      this.isLoading = false; 
    });
  }

  // Método para registrar el estado de ánimo
  setMood(mood: string) {
    if (this.moodRegisteredToday) {
      alert('Ya registraste tu estado de ánimo hoy.');
      return;
    }

    this.userService.registerMood(mood).subscribe(
      response => {
        console.log('Estado de ánimo registrado:', response);
        this.moodRegisteredToday = true;
      },
      error => {
        if (error.status === 400) {
          alert('Ya registraste tu estado de ánimo hoy.');
          this.moodRegisteredToday = true;
        } else {
          alert('Error al registrar estado de ánimo.');
        }
      }
    );
  }
}