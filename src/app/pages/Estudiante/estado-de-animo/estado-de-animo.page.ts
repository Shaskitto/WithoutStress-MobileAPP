import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-estado-de-animo',
  templateUrl: './estado-de-animo.page.html',
  styleUrls: ['./estado-de-animo.page.scss'],
})
export class EstadoDeAnimoPage implements OnInit {
  moodRegisteredToday = false;
  
  constructor(private userService: UserService, private router: Router, private planService: PlanService) { }

  ngOnInit() {
    // Verificar si ya existe un plan cargado (por si hay uno generado previamente)
    this.planService.plan$.subscribe(plan => {
      if (plan) {
        console.log('Plan cargado desde el servicio:', plan);
      }
    });
  }

  // Método para registrar el estado de ánimo
  setMood(mood: string) {
    if (this.moodRegisteredToday) return;
  
    this.userService.registerMood(mood).subscribe(
      response => {
        console.log('Estado de ánimo registrado:', response);
        this.moodRegisteredToday = true;
  
        // Llamar a generarPlan SOLO después de registrar el estado de ánimo
        this.planService.generarPlan(mood).subscribe(
          plan => {
            console.log('Plan generado:', plan);
            this.router.navigate(['/tabs/plan']);
          },
          error => {
            console.error('Error al generar el plan:', error);
            alert('Ocurrió un error al generar el plan.');
            this.router.navigate(['/tabs/plan']);
          }
        );
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