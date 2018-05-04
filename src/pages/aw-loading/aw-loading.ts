import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-loading',
  templateUrl: 'aw-loading.html',
})
export class AwLoadingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.navCtrl.setRoot("AwWalkthroughPage");
    }, 1000);
  }

}
