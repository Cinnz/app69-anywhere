import { Component } from '@angular/core';
import { Platform, MenuController, NavController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage: any = "AwLoadingPage";
  rootPage: any = "AwHomePage";

  menuTexts = {
    circle: "Vòng kết nối",
    function: "Chức năng",
    new: "Thêm mới",
    join: "Tham gia",
  }

  menuDatas = {
    username: "Hoài Nam",
    avatar: "./assets/imgs/logo.png",
    circles: [{
      id: 1,
      name: "Vòng kết nối 1"
    }, {
      id: 2,
      name: "Vòng kết nối 2"
    }],
    currentCircleId: 1,
    functions: [{
      id: 1,
      name: "Hướng dẫn sử dụng",
      component: ""
    }, {
      id: 2,
      name: "Câu hỏi thường gặp",
      component: ""
    }, {
      id: 3,
      name: "Cài đặt",
      component: ""
    }]
  }

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private app: App,
    private menu: MenuController) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.id != this.rootPage.id) {
      this.rootPage = page.component;
      // this.mSelectedMenuId = page.id;
    }
    // close the menu when clicking a link from the menu
    this.menu.close();
  }

  onClickCircle(circle) {
    if (this.menuDatas.currentCircleId != circle.id) {
      this.menuDatas.currentCircleId = circle.id;
    }
  }

  onClickAddCircle() {
    this.app.getRootNav().push("AwCreateCirclePage", { isSignUp: false });
    this.menu.close();
  }
}
