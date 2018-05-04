import { AwModule } from './../../providers/aw-module/aw-module';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-aw-create-circle',
  templateUrl: 'aw-create-circle.html',
})
export class AwCreateCirclePage {

  mTexts = {
    title: "Tạo vòng kết nối của bạn",
    nameTitle: "Tên vòng kết nối",
    inputHolder: "Chưa nhập tên",
    suggestTitle: "Chọn nhanh",
    suggests: ["Gia đình", "Người ấy", "Bạn bè", "Cơ quan", "Du lịch", "Vui chơi"],
    start: "Bắt đầu sử dụng"
  }

  mDatas = {
    circleName: "",
    isSignUp: false
  }

  constructor(public navCtrl: NavController,
    public mAwModule: AwModule,
    public navParams: NavParams) {
    if (navParams.get('isSignUp')) {
      this.mDatas.isSignUp = navParams.get('isSignUp');
    }
  }

  onClickSuggestItem(item) {
    this.mDatas.circleName = item;
  }

  onClickNext() {
    this.mAwModule.createNewCircle(this.mDatas.circleName);
    this.navCtrl.setRoot("AwHomePage");
  }
  
  onClickClose(){
    this.navCtrl.pop();
  }

}
