import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecursoDetallePage } from './recurso-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: RecursoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecursoDetallePageRoutingModule {}
