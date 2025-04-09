import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PsicologoTabsPage } from './psicologo-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: PsicologoTabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil-psicologo/perfil-psicologo.module').then(m => m.PerfilPsicologoPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsicologoTabsRoutingModule { }
