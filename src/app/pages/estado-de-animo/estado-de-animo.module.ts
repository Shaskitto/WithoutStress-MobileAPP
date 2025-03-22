import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoDeAnimoPageRoutingModule } from './estado-de-animo-routing.module';

import { EstadoDeAnimoPage } from './estado-de-animo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadoDeAnimoPageRoutingModule
  ],
  declarations: [EstadoDeAnimoPage]
})
export class EstadoDeAnimoPageModule {}
