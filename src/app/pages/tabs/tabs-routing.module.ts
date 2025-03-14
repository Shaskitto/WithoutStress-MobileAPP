import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'plan',
        loadChildren: () => import('../plan/plan.module').then(m => m.PlanPageModule)
      },
      {
        path: 'explorar',
        loadChildren: () => import('../explorar/explorar.module').then(m => m.ExplorarPageModule)
      },
      {
        path: 'comunidad',
        loadChildren: () => import('../comunidad/comunidad.module').then(m => m.ComunidadPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'calendario',
        loadChildren: () => import('../calendario/calendario.module').then(m => m.CalendarioPageModule)
      }
    ]
  },
  { 
    path: '', 
    redirectTo: '/bienvenida', 
    pathMatch: 'full' 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
