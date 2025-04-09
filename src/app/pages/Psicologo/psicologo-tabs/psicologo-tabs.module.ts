import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PsicologoTabsRoutingModule } from './psicologo-tabs-routing.module';
import { PsicologoTabsPage } from './psicologo-tabs.page';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [PsicologoTabsPage],
  imports: [
    CommonModule,
    IonicModule,
    PsicologoTabsRoutingModule
  ]
})
export class PsicologoTabsModule { }
