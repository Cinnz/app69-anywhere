import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-circle-detail',
  templateUrl: 'aw-circle-detail.html',
})
export class AwCircleDetailPage {

  mTexts = {
    title: "Vòng kết nối"
  }

  mDatas = {
    circleId: "",
    circleName: "",
    circleMembers: [],
    circleNewMessages: 0
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AwCircleDetailPage');
  }

  onClickClose(){
    this.navCtrl.pop();
  }
}
