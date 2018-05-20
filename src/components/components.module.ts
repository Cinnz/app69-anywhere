import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AwLoadingComponent } from './aw-loading/aw-loading';
import { AwDatePickerComponent } from './aw-date-picker/aw-date-picker';
@NgModule({
	declarations: [AwLoadingComponent,
    AwDatePickerComponent],
	imports: [IonicPageModule],
	exports: [AwLoadingComponent,
    AwDatePickerComponent]
})
export class ComponentsModule { }
