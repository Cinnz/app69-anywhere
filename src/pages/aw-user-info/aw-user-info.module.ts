import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwUserInfoPage } from './aw-user-info';

@NgModule({
  declarations: [
    AwUserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AwUserInfoPage),
  ],
})
export class AwUserInfoPageModule {}
