import { User } from './../providers/aw-classes/user';
import { AwModule } from './../providers/aw-module/aw-module';
import { Component } from '@angular/core';
import { Platform, MenuController, NavController, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "AwLoadingPage";
  // rootPage: any = "AwChatPage";

  menuTexts = {
    circle: "Vòng kết nối",
    function: "Chức năng",
    new: "Thêm mới",
    join: "Tham gia vòng kết nối mới",
  }

  menuDatas = {
    username: "",
    avatar: "",
    circles: [],
    currentCircleId: "",
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
    private mAwModule: AwModule,
    private mEvents: Events,
    private app: App,
    private menu: MenuController) {

    platform.ready().then(() => {
      // this.rootPage = "AwLoadingPage";
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


      mEvents.subscribe("circleId: changed", (circleId: string) => {
        this.menuDatas.currentCircleId = circleId;
      });

      // Event update user's info from AwModule
      mEvents.subscribe("user: changed", (data: User) => {
        this.menuDatas.username = data.name;
        this.menuDatas.avatar = data.avatar;
        this.menuDatas.circles = data.circles;

        if (!this.menuDatas.currentCircleId) {
          this.mEvents.publish("circle: changed", data.circles[0].id)
          this.menuDatas.currentCircleId = data.circles[0].id;
        }
      });
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

  private onClickUserInfo() {
    this.app.getRootNav().push("AwUserInfoPage");
    this.menu.close();
  }

  private onClickCircle(circle) {
    if (this.menuDatas.currentCircleId != circle.id) {
      this.menuDatas.currentCircleId = circle.id;
      this.mEvents.publish("circle: changed", circle.id)
    }
    this.menu.close();
  }

  private onClickAddCircle() {
    this.app.getRootNav().push("AwCreateCirclePage", { isSignUp: false });
    this.menu.close();
  }

  private onClickJoinCircle() {
    this.app.getRootNav().push("AwJoinCirclePage");
    this.menu.close();
  }
}
