import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/Estudiante/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'plan',
    loadChildren: () => import('./pages/Estudiante/plan/plan.module').then( m => m.PlanPageModule)
  },
  {
    path: 'explorar',
    loadChildren: () => import('./pages/Estudiante/explorar/explorar.module').then( m => m.ExplorarPageModule)
  },
  {
    path: 'comunidad',
    loadChildren: () => import('./pages/Estudiante/comunidad/comunidad.module').then( m => m.ComunidadPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/bienvenida/bienvenida.module').then( m => m.BienvenidaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/Estudiante/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'evaluacion',
    loadChildren: () => import('./pages/Estudiante/evaluacion/evaluacion.module').then( m => m.EvaluacionPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/Estudiante/calendario/calendario.module').then( m => m.CalendarioPageModule)
  },
  {
    path: 'estadistica',
    loadChildren: () => import('./pages/Estudiante/estadistica/estadistica.module').then( m => m.EstadisticaPageModule)
  },
  {
    path: 'estado-de-animo',
    loadChildren: () => import('./pages/Estudiante/estado-de-animo/estado-de-animo.module').then( m => m.EstadoDeAnimoPageModule)
  },
  {
    path: 'psicologo-tabs',
    loadChildren: () => import('./pages/Psicologo/psicologo-tabs/psicologo-tabs.module').then(m => m.PsicologoTabsModule)
  },
  {
    path: 'recurso-detalle/:id',
    loadChildren: () => import('./pages/Estudiante/recurso-detalle/recurso-detalle.module').then( m => m.RecursoDetallePageModule)
  },
  {
    path: 'mensaje',
    loadChildren: () => import('./pages/mensaje/mensaje.module').then( m => m.MensajePageModule)
  },  {
    path: 'preguntas',
    loadChildren: () => import('./pages/preguntas/preguntas.module').then( m => m.PreguntasPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
