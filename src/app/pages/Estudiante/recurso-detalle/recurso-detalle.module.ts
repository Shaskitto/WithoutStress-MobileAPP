import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecursoDetallePageRoutingModule } from './recurso-detalle-routing.module';

import { RecursoDetallePage } from './recurso-detalle.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecursoDetallePageModule
      }
    ]),
    RecursoDetallePageRoutingModule
  ],
  declarations: [RecursoDetallePage]
})
export class RecursoDetallePageModule {}
