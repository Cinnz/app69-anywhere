import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-login',
  templateUrl: 'aw-login.html',
})
export class AwLoginPage {

  mTexts = {
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    savePassword: "Ghi nhớ mật khẩu",
    logIn: "Đăng nhập",
    signUp: "Tạo tài khoản"
  }

  mDatas = {
    username: "",
    password: "",
    isSavingPassword: false
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
  }

  onClickSignUp() {
    this.navCtrl.push("AwSignupPage", null, { animation: 'ios-transition' });
  }

  onClickSavePassword(){
    this.mDatas.isSavingPassword = ! this.mDatas.isSavingPassword;
  }

}
