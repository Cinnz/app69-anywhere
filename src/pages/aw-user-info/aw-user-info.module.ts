import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwUserInfoPage } from './aw-user-info';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AwUserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AwUserInfoPage),
    ComponentsModule
  ],
})
export class AwUserInfoPageModule {}
