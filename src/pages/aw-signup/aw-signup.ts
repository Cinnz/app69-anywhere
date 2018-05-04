import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-signup',
  templateUrl: 'aw-signup.html',
})
export class AwSignupPage {

  mTexts = {
    username: "Username",
    password: "Password",
    confirm: "Confirm",
    logIn: "Đã có tài khoản",
    signUp: "Đăng ký",
    create: "Tạo tài khoản"
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
  }

  onSigningUp() {
    // check

    this.navCtrl.setRoot("AwCreateLocationPage");

  }

  onClickLogin() {
    this.navCtrl.pop({ animation: 'ios-transition' });
  }

  onClickSignUp() {
    this.onSigningUp();
  }

}
