import { Location } from './../../providers/aw-classes/location';
import { Trace } from './../../providers/aw-classes/trace';
import { Circle } from './../../providers/aw-classes/circle';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, ActionSheetController } from 'ionic-angular';
import {
  GoogleMap, GoogleMaps, GoogleMapOptions,
  LocationService,
  GoogleMapsEvent
} from '@ionic-native/google-maps';
import { UserBase } from '../../providers/aw-classes/user-base';


@IonicPage()
@Component({
  selector: 'page-aw-home',
  templateUrl: 'aw-home.html',
})
export class AwHomePage {
  private onTest = true;

  map: GoogleMap

  mTexts = {
    title: "Vòng kết nối",
    chatButton: "Trò chuyện nhóm"
  }

  mDatas = {
    circleId: "",
    circleName: "",
    circleMembers: [],
    circleNewMessages: 0
  }

  constructor(public navCtrl: NavController,
    private mMenuController: MenuController,
    private mActionSheetController: ActionSheetController,
    private mPlatform: Platform,
    public navParams: NavParams) {
    this.onLoadData().then((circle: Circle) => {
      console.log("done", circle);
      console.log("mDatas", this.mDatas);

      this.mDatas.circleId = circle.id;
      this.mDatas.circleName = circle.name;
      this.mDatas.circleMembers = circle.members;
    });
  }

  ionViewDidLoad() {
    this.mPlatform.ready().then(() => {
      if (this.mPlatform.is('android') || this.mPlatform.is('ios')) {
        // this.loadMap();
      }

    });
  }

  loadMap() {
    if (!this.map) {
      let mapElement = document.getElementById("map");

      LocationService.getMyLocation({ enableHighAccuracy: true }).then(location => {

        let mapOption: GoogleMapOptions = {
          mapType: 'MAP_TYPE_ROADMAP',
          controls: {
            compass: true,
            myLocation: true,
            myLocationButton: true,
            indoorPicker: false,
            mapToolbar: false,
            zoom: false
          },
          gestures: {
            scroll: true,
            tile: false,
            zoom: true,
            rotate: true
          },
          camera: {
            target: location.latLng,
            zoom: 17,
            duration: 1000
          },
          preferences: {
            zoom: {
              minZoom: 12,
              maxZoom: 19
            },
            building: false,
          }
        }
        this.map = GoogleMaps.create(mapElement, mapOption);
      });
    }
  }

  onLoadData() {
    if (this.onTest) {
      return new Promise((res, rej) => {
        let circle = new Circle("01234", "Bạn bè", "u9999");
        let user1 = new UserBase("u0001", "Mr A", "./assets/imgs/logo.png", true);
        let user2 = new UserBase("u0002", "Nguyễn Văn B", "./assets/imgs/logo.png", false);
        let user3 = new UserBase("u0003", "Trần Minh C", "./assets/imgs/logo.png", true);
        let user4 = new UserBase("u0003", "Lê Văn D", "./assets/imgs/logo.png", true);
        let user5 = new UserBase("u0003", "Dương Tùng E", "./assets/imgs/logo.png", false);

        let location1 = new Location();
        location1.time = 1525419420000;
        location1.address = "1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội";
        let location2 = new Location();
        location2.time = 1525448220000;
        user1.updateLocation(location1)
        user2.updateLocation(location2)
        user3.updateLocation(location1)
        user4.updateLocation(location1)
        user5.updateLocation(location1)
        console.log(user1.time);


        circle.addMembers([user1, user2, user3, user4, user5]);

        // setTimeout(() => {
        res(circle);
        // }, 3000);
      })
    }
    else {

    }
  }

  onClickMenu() {
    this.mMenuController.open();
  }

  onClickMore() {
    // this.mActionSheetController.create({
    //   title: "Tùy chọn",
    //   subTitle: "subTitle",
    //   buttons: [{
    //     text: "Tạo mới lộ trình/địa điểm",
    //     handler?: () => boolean | void;
    //   }],
    //   enableBackdropDismiss: true
    // });
  }
}
