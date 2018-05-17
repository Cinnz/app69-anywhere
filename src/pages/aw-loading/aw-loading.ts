import { AwModule } from './../../providers/aw-module/aw-module';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-loading',
  templateUrl: 'aw-loading.html',
})
export class AwLoadingPage {

  constructor(public navCtrl: NavController,
    private mAwModule: AwModule,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.mAwModule.subscribeNetworkDisconnected();
    setTimeout(() => {
      this.navCtrl.setRoot("AwWalkthroughPage");
    }, 1000);
  }

}
