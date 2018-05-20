import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwCreateRoutePage } from './aw-create-route';

@NgModule({
  declarations: [
    AwCreateRoutePage,
  ],
  imports: [
    IonicPageModule.forChild(AwCreateRoutePage),
    ComponentsModule
  ],
})
export class AwCreateRoutePageModule {}
