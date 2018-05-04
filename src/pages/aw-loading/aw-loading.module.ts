import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwLoadingPage } from './aw-loading';

@NgModule({
  declarations: [
    AwLoadingPage,
  ],
  imports: [
    IonicPageModule.forChild(AwLoadingPage),
  ],
})
export class AwLoadingPageModule {}
