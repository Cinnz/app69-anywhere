import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mTexts = {
    title: "Vòng kết nối"
  }

  constructor(public navCtrl: NavController,
    private mMenuController: MenuController) {

  }

  onClickMenu() {
    this.mMenuController.open();
  }
}
