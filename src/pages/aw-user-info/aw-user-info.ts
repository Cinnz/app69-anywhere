import { User } from './../..//providers/anywhere/aw-classes/user';
import { AwModule } from './../..//providers/anywhere/aw-module/aw-module';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
  selector: 'page-aw-user-info',
  templateUrl: 'aw-user-info.html',
})
export class AwUserInfoPage {

  mTexts = {
    title: "Thông tin người dùng",
    getCode: "Lấy mã chia sẻ",
    signOut: "Đăng xuất",
    dynamicCode: "Mã tạm thời"
  }

  mDatas: {
    user: User,
    isShowCodes: boolean,
    onLoading: boolean,
    isGettingNewCode: boolean
  } = {
      user: null,
      isShowCodes: false,
      onLoading: false,
      isGettingNewCode: false
    }


  constructor(public navCtrl: NavController,
    private mClipboard: Clipboard,
    private mAwModule: AwModule,
    private mToastController: ToastController,
    public navParams: NavParams) {
  }

  ionViewWillEnter() {
    // for test

    // this.mAwModule.fakeLogin().then(() => {
    //   this.mDatas.user = this.mAwModule.user;
    // });

    // for real: 
    this.mDatas.user = this.mAwModule.user;
  }

  showLoading() {
    this.mDatas.onLoading = true;
  }

  hideLoading() {
    this.mDatas.onLoading = false;
  }

  get staticCode() {
    return this.mDatas.user.staticCode;
  }

  get dynamicCode() {
    return this.mDatas.user.dynamicCode;
  }

  onClickClose() {
    this.navCtrl.pop();
  }

  onClickGetCode() {
    this.mDatas.isShowCodes = true;
  }

  onClickBackdrop() {
    this.mDatas.isShowCodes = false;
  }

  onClickStaticCode() {
    this.mClipboard.copy(this.staticCode).then(() => {
      this.showToast("Lưu vào Clipboard: " + this.staticCode, 1000);
    });
  }

  onClickDynamicCode() {
    if (!this.mDatas.isGettingNewCode) {
      this.mClipboard.copy(this.dynamicCode).then(() => {
        this.showToast("Lưu vào Clipboard: " + this.dynamicCode, 1000);
      });;
    }
  }

  onClickRefreshDynamicCode() {
    this.mDatas.isGettingNewCode = true;

    this.mAwModule.getNewConnectCode().then(() => {
      this.mDatas.isGettingNewCode = false;
    });
  }

  onClickContainer() {
    event.stopPropagation();
  }

  onClickLogOut() {
    this.showLoading();
    this.mAwModule.logOut().then(() => {
      this.hideLoading();
      this.navCtrl.setRoot("AwLoginPage");
    });
  }

  showToast(message: string, duration?: number) {
    let toast = this.mToastController.create({
        message: message,
        duration: duration ? duration : 2000
    });

    toast.present();
}
}
