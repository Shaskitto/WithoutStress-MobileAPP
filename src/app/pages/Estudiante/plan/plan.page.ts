import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { Router } from '@angular/router';
import { ResourceService } from 'src/app/services/resource.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {
  isLoading = true;
  plan: any;
  franjas = ['Manana', 'Tarde', 'Noche'];
  errorMessage: string | null = null;

  constructor(
    private planService: PlanService,
    private resourceService: ResourceService,
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(userId => {
      if (userId) {
        console.log('Usuario logueado con ID:', userId);
        this.obtenerPlan(userId); 
      } else {
        console.log('No se encontró el ID de usuario.');
      }
    });
  }

  obtenerPlan(userId: string) {
    this.isLoading = true;
    this.errorMessage = null;

    this.planService.obtenerPlan(userId).subscribe({
      next: (data) => {
        this.plan = data;
        this.isLoading = false;

        this.franjas.forEach(franja => {
          const actividadIds = this.plan?.planDiario?.data?.[franja] || [];
          
          actividadIds.forEach((id: string) => {
            this.resourceService.getResource(id).subscribe({
              next: (recursoData) => {
                const actividad = {
                  _id: id,
                  detalle: recursoData
                };

                if (!this.plan[franja]) {
                  this.plan[franja] = [];
                }

                this.plan[franja].push(actividad);
              }
            });
          });
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getFranjasPlanificadas() {
    return this.franjas.filter(franja =>
      this.plan?.planDiario?.data?.[franja]?.length > 0
    );
  }

  getNombreFranjaBonito(franja: string): string {
    switch (franja) {
      case 'Manana': return 'Mañana';
      case 'Tarde': return 'Tarde';
      case 'Noche': return 'Noche';
      default: return franja;
    }
  }

  getIconForFranja(franja: string): string {
    switch (franja) {
      case 'Manana': return 'sunny';
      case 'Tarde': return 'partly-sunny';
      case 'Noche': return 'moon';
      default: return 'time';
    }
  }

  verDetalle(resourceId: string) {
    this.router.navigate(['/recurso-detalle', resourceId]);
  }
}
