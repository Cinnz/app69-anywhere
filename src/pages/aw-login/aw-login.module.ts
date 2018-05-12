import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwLoginPage } from './aw-login';

@NgModule({
  declarations: [
    AwLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(AwLoginPage),
    ComponentsModule
  ],
})
export class AwLoginPageModule {}
