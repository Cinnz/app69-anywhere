import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwJoinCirclePage } from './aw-join-circle';

@NgModule({
  declarations: [
    AwJoinCirclePage,
  ],
  imports: [
    IonicPageModule.forChild(AwJoinCirclePage),
    ComponentsModule
  ],
})
export class AwJoinCirclePageModule {}
