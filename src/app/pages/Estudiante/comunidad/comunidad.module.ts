import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComunidadPageRoutingModule } from './comunidad-routing.module';

import { ComunidadPage } from './comunidad.page';
import { ChatBoxComponent } from 'src/app/components/chat-box/chat-box.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComunidadPageRoutingModule
  ],
  declarations: [ComunidadPage, ChatBoxComponent]
})
export class ComunidadPageModule {}
