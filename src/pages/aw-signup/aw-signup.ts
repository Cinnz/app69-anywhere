import { AwModule } from './../../providers/aw-module/aw-module';
import { AccountValidators } from './../../validators/account.validators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-signup',
  templateUrl: 'aw-signup.html',
})
export class AwSignupPage {

  mTexts = {
    phonenumber: "Số điện thoại",
    password: "Mật khẩu",
    confirm: "Xác nhận mật khẩu",
    logIn: "Đã có tài khoản",
    signUp: "Đăng ký",
    create: "Tạo tài khoản"
  }

  mDatas = {
    minPassword: 6,
    onLoading: false
  }

  form = new FormGroup({
    phonenumber: new FormControl('', [
      Validators.required,
      AccountValidators.isValidPhoneNumber
    ]),
    passwordGroup: new FormGroup({
      password: new FormControl("", [Validators.required, Validators.minLength(this.mDatas.minPassword)]),
      confirm: new FormControl("", [Validators.required])
    }, null, AccountValidators.passwordShouldMatch)
  });

  constructor(public navCtrl: NavController,
    private mAwModule: AwModule,
    private mMenuController: MenuController,
    private mToastController: ToastController) {
  }

  ionViewDidLoad() {
    this.mMenuController.enable(false);
  }
  
  get phonenumber() {
    return this.form.get("phonenumber");
  }

  get password() {
    return this.form.get("passwordGroup").get("password");
  }

  get confirm() {
    return this.form.get("passwordGroup").get("confirm");
  }

  get passwordGroup() {
    return this.form.get("passwordGroup");
  }

  showLoading() {
    this.mDatas.onLoading = true;
  }

  hideLoading() {
    this.mDatas.onLoading = false;
  }

  showToast(message: string, duration?: number) {
    let toast = this.mToastController.create({
      message: message,
      duration: duration ? duration : 2000
    });

    toast.present();
  }

  onClickSignUp() {
    if (this.form.valid) {
      this.showLoading();

      let phonenumber = "0" + this.form.value.phonenumber;
      let password = this.passwordGroup.value.password;

      this.mAwModule.signUp(phonenumber, password).then(data => {
        this.hideLoading();
        if (data['success']) {
          this.navCtrl.setRoot("AwCreateLocationPage");
        }
        else {
          if (data['msg']) {
            this.showToast(data['msg']);
          }
        }
      }).catch(e => {
        this.hideLoading();
        this.showToast("Vui lòng kiểm tra kết nối mạng")
      });
    }
    else {
      if (this.phonenumber.errors) {
        this.showToast("Số điện thoại không hợp lệ");
      }
      else if (this.password.errors) {
        this.showToast("Mật khẩu dài tối thiểu " + this.mDatas.minPassword + " ký tự");
      }
      else if (this.passwordGroup.errors) {
        this.showToast("Mật khẩu xác nhận không khớp");
      }
    }
  }

  onClickLogin() {
    this.navCtrl.pop({ animation: 'ios-transition' });
  }

}
