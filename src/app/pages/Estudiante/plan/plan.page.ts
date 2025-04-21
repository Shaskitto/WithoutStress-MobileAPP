import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ResourceService } from 'src/app/services/resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit, ViewWillEnter {
  user$: Observable<any> | undefined;
  horarios: any;
  isLoading = true;
  planDiario: any;

  constructor(
    private userService: UserService,
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.loadUserData();
  }

  loadUserData() {
    this.user$ = this.userService.getUser().pipe(
      catchError((error) => {
        console.error('Error al obtener los datos del usuario', error);
        return of(null);
      })
    );
  
    this.user$.subscribe((user) => {
      if (!user) {
        this.isLoading = false;
        return;
      }
  
      const planGuardadoRaw = localStorage.getItem('planDiario');
      const planGuardado = planGuardadoRaw ? JSON.parse(planGuardadoRaw) : null;
      const horarioActual = user.horario;
  
      const horarioGuardado = planGuardado?.horario;
  
      if (planGuardado && JSON.stringify(horarioGuardado) === JSON.stringify(horarioActual)) {
        this.planDiario = planGuardado.data;
        this.isLoading = false;
      } else {
        this.horarios = horarioActual;
        this.generarPlan(user);
      }
    });
  }
  

  generarPlan(user: any) {
    const estadoActual = user.estadoDeAnimo?.sort(
      (a: any, b: any) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )[0]?.estado;
  
    const categoriasPorEstado: any = {
      'Muy bien': {
        Manana: ['Aprender', 'Ejercicios de Respiración'],
        Tarde: ['Meditación y Mindfulness', 'Podcast'],
        Noche: ['Música y Sonidos Relajantes', 'Meditación y Mindfulness'],
      },
      Bien: {
        Manana: ['Aprender', 'Podcast'],
        Tarde: ['Meditación y Mindfulness', 'Meditación'],
        Noche: ['Música y Sonidos Relajantes', 'Ejercicios de Respiración'],
      },
      Neutro: {
        Manana: ['Ejercicios de Respiración', 'Aprender'],
        Tarde: ['Podcast', 'Mindfulness'],
        Noche: ['Música y Sonidos Relajantes', 'Meditación y Mindfulness'],
      },
      Mal: {
        Manana: ['Ejercicios de Respiración', 'Meditación y Mindfulness'],
        Tarde: ['Podcast', 'Mindfulness'],
        Noche: ['Música y Sonidos Relajantes', 'Meditación y Mindfulness'],
      },
      'Muy mal': {
        Manana: ['Ejercicios de Respiración', 'Meditación y Mindfulness'],
        Tarde: ['Podcast', 'Mindfulness'],
        Noche: ['Música y Sonidos Relajantes', 'Meditación y Mindfulness'],
      },
    };
  
    const categoriasPorFranja = categoriasPorEstado[estadoActual] || {};
    const plan: any = {};
  
    const peticiones: Observable<any>[] = [];
  
    for (const franja in categoriasPorFranja) {
      const franjaLower = franja.toLowerCase(); 
  
      if (!user.horario[franjaLower] || user.horario[franjaLower].length === 0) {
        continue;
      }
  
      plan[franja] = [];
  
      const cantidadRecursos = user.horario[franjaLower].length; 
      const categorias = categoriasPorFranja[franja];
  
      const categoriasSeleccionadas = categorias.slice(0, cantidadRecursos);
  
      categoriasSeleccionadas.forEach((categoria: string) => {
        peticiones.push(
          this.resourceService.getByCategory(categoria).pipe(
            catchError(err => {
              console.error(err);
              return of([]);
            })
          )
        );
      });
    }

    forkJoin(peticiones).subscribe((respuestas) => {
      let i = 0;

      for (const franja in categoriasPorFranja) {
        const recursosFranja: any[] = [];
  
        for (let j = 0; j < user.horario[franja.toLowerCase()].length; j++) {
          const recursos = respuestas[i++] || [];
          if (recursos.length > 0) {
            const random = recursos[Math.floor(Math.random() * recursos.length)];
            recursosFranja.push(random);
          }
        }
  
        plan[franja] = recursosFranja;
      }

      this.planDiario = plan;
      this.isLoading = false;

      const planCompleto = {
        data: plan,
        horario: user.horario,
      };
      
      localStorage.setItem('planDiario', JSON.stringify(planCompleto));
    });
  }
  
  getFranjasPlanificadas(): string[] {
    if (!this.planDiario) return [];
    return Object.keys(this.planDiario).filter(franja => {
      return this.planDiario[franja] && this.planDiario[franja].length > 0;
    });
  }
  

  getIconForFranja(franja: string): string {
    switch (franja.toLowerCase()) {
      case 'manana':
        return 'sunny-outline';
      case 'tarde':
        return 'partly-sunny-outline';
      case 'noche':
        return 'moon-outline';
      default:
        return 'time-outline';
    }
  }

  getNombreFranjaBonito(franja: string): string {
    switch (franja.toLowerCase()) {
      case 'manana':
        return 'Mañana';
      case 'tarde':
        return 'Tarde';
      case 'noche':
        return 'Noche';
      default:
        return franja;
    }
  }  

  verDetalle(resourceId: string) {
    this.router.navigate(['/recurso-detalle', resourceId]);
  }
}
