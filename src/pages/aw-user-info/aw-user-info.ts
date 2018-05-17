import { User } from './../../providers/aw-classes/user';
import { AwModule } from './../../providers/aw-module/aw-module';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-user-info',
  templateUrl: 'aw-user-info.html',
})
export class AwUserInfoPage {

  mTexts = {
    title: "Thông tin người dùng",
    getCode: "Lấy mã chia sẻ",
    signOut: "Đăng xuất"
  }

  mDatas: {
    user: User
  } = {
      user: null
    }


  constructor(public navCtrl: NavController,
    private mAwModule: AwModule,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.mAwModule.login("","").then(() => {

      this.mDatas.user = this.mAwModule.user;
      console.log(this.mDatas.user);
    });

  }

  onClickClose(){
    this.navCtrl.pop();
  }

}
