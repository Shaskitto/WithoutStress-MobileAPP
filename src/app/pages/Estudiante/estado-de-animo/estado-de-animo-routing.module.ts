import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoDeAnimoPage } from './estado-de-animo.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoDeAnimoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoDeAnimoPageRoutingModule {}
