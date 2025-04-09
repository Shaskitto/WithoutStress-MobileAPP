import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPsicologoPageRoutingModule } from './perfil-psicologo-routing.module';

import { PerfilPsicologoPage } from './perfil-psicologo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PerfilPsicologoPageRoutingModule
  ],
  declarations: [PerfilPsicologoPage]
})
export class PerfilPsicologoPageModule {}
