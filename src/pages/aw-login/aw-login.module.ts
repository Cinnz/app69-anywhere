import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwLoginPage } from './aw-login';

@NgModule({
  declarations: [
    AwLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(AwLoginPage),
  ],
})
export class AwLoginPageModule {}
