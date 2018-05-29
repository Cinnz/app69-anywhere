import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AwLoadingComponent } from './aw-loading/aw-loading';
import { AwDatePickerComponent } from './aw-date-picker/aw-date-picker';
import { AwVerifyOtpComponent } from './aw-verify-otp/aw-verify-otp';
@NgModule({
	declarations: [AwLoadingComponent,
    AwDatePickerComponent,
    AwVerifyOtpComponent],
	imports: [IonicPageModule],
	exports: [AwLoadingComponent,
    AwDatePickerComponent,
    AwVerifyOtpComponent]
})
export class ComponentsModule { }
