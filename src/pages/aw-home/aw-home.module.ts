import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwHomePage } from './aw-home';

@NgModule({
  declarations: [
    AwHomePage,
  ],
  imports: [
    IonicPageModule.forChild(AwHomePage),
    ComponentsModule
  ],
})
export class AwHomePageModule {}
