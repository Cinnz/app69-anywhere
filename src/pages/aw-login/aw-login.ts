import { AwModule } from './../../providers/aw-module/aw-module';
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
    isSavingPassword: false,
    onLoading: false
  }

  constructor(public navCtrl: NavController,
    private mAwModule: AwModule,
    public navParams: NavParams) {
  }

  showLoading() {
    this.mDatas.onLoading = true;
  }

  hideLoading() {
    this.mDatas.onLoading = false;
  }

  onClickSignUp() {
    this.navCtrl.push("AwSignupPage", null, { animation: 'ios-transition' });
  }

  onClickSavePassword() {
    this.mDatas.isSavingPassword = !this.mDatas.isSavingPassword;
  }

  onClickLogin() {
    this.showLoading();
    this.mAwModule.login(this.mDatas.username, this.mDatas.password).then(() => {
      this.hideLoading();
      this.navCtrl.setRoot("AwHomePage")
    });
  }

}
