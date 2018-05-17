import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwSignupPage } from './aw-signup';

@NgModule({
  declarations: [
    AwSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(AwSignupPage),
    ComponentsModule
  ],
})
export class AwSignupPageModule {}
