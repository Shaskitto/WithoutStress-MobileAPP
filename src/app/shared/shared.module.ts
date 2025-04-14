import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChatBoxComponent } from '../components/chat-box/chat-box.component'; 

@NgModule({
  declarations: [
    ChatBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    ChatBoxComponent
  ]
})
export class SharedModule {}
