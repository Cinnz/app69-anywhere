import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwChatPage } from './aw-chat';

@NgModule({
  declarations: [
    AwChatPage,
  ],
  imports: [
    IonicPageModule.forChild(AwChatPage),
  ],
})
export class AwChatPageModule {}
