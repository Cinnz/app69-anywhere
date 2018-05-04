import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-walkthrough',
  templateUrl: 'aw-walkthrough.html',
})
export class AwWalkthroughPage {

  mTexts = {
    next: "next"
  }

  mDatas = {
    slides: [
      {
        icon: "./assets/imgs/connection.png",
        title: "Connecting people",
        subTitle: "Connect people together Connect people together Connect people together Connect people together Connect people together"
      },
      {
        icon: "./assets/imgs/travel.png",
        title: "Location",
        subTitle: "Connect people together"
      }
    ]
  }

  constructor(public navCtrl: NavController) {
  }

  onClickNext(){
    this.navCtrl.setRoot("AwLoginPage");
  }
}
