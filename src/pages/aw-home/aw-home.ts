import { Utils } from './../../providers/app-utils';
import { AwModule } from './../../providers/aw-module/aw-module';
import { Member } from './../../providers/aw-classes/member';
import { Location } from './../../providers/aw-classes/location';
import { Trace } from './../../providers/aw-classes/trace';
import { Circle } from './../../providers/aw-classes/circle';
import { Component, ViewChild, ElementRef } from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  Platform,
  ActionSheetController,
  Events
} from 'ionic-angular';

import {
  GoogleMap, GoogleMaps, GoogleMapOptions,
  LocationService,
  GoogleMapsEvent,
  MarkerOptions,
  Marker,
  LatLng,
  CameraPosition,
  ILatLng,
  PolylineOptions,
  Polyline
} from '@ionic-native/google-maps';

import { UserBase } from '../../providers/aw-classes/user-base';

@IonicPage()
@Component({
  selector: 'page-aw-home',
  templateUrl: 'aw-home.html',
})
export class AwHomePage {
  @ViewChild('members') members: ElementRef;
  private onTest = true;

  map: GoogleMap

  mTexts = {
    title: "Vòng kết nối",
    chatButton: "Trò chuyện nhóm",
    pickDate: "Ngày cần xem",
    notPublic: "Người dùng này không chia sẻ lộ trình"
  }

  mDatas: {
    circleId: string,
    circleName: string,
    circleMembers: Array<Member>,
    circleNewMessages: number,
    isOnDetail: boolean,
    memberDetail: Member,
    onLoading: boolean,
    currentDateView: Date,
    currentTrace: Array<Location>,
    currentRoute: Polyline,
    currentSteps: Array<Marker>
  } = {
      circleId: "",
      circleName: "",
      circleMembers: [],
      circleNewMessages: 0,
      isOnDetail: false,
      memberDetail: null,
      onLoading: false,
      currentDateView: new Date(),
      currentTrace: [],
      currentRoute: null,
      currentSteps: []
    }

  constructor(public navCtrl: NavController,
    private mMenuController: MenuController,
    private mEvents: Events,
    private mActionSheetController: ActionSheetController,
    private mAwModule: AwModule,
    private mPlatform: Platform,
    public navParams: NavParams) {
    console.log("constructor");


    //Event change current circle on View from Menu
    mEvents.subscribe("circle: changed", (circleId: string) => {
      this.showLoading();
      this.hideRouteOnMap();
      this.hideMembersOnMap();

      this.mAwModule.getCircleById(circleId).then((circle: Circle) => {
        this.onUpdateCircleData(circle);
        this.hideLoading();
        this.showMembersOnMap();
      });
    });

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");

    // for test
    this.mAwModule.login("", "");

    this.mAwModule.onFirstTime();

  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.mPlatform.ready().then(() => {
      if (this.mPlatform.is('android') || this.mPlatform.is('ios')) {
        this.loadMap();
      }
    });
  }

  imageToBase64(imgUrl: string) {
    let img = document.createElement("img");
    img.setAttribute('src', imgUrl);
    img.style.transform = "scale(0.5, 0.5)"

    let radius = (img.width < img.height) ? (img.width / 2) : (img.height / 2);

    var canvas, ctx, dataURL, base64;
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    let scale = 0.5;

    // ctx.scale(scale, scale);
    // ctx.translate(img.width + img.width * scale, img.height + img.height * scale);

    ctx.drawImage(img, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(img.width / 2, img.height / 2, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();

    dataURL = canvas.toDataURL("image/png");
    base64 = dataURL.replace(/^data:image\/png;base64,/, "");
    return base64;
  }

  loadMap() {
    console.log("Load Map");

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

        this.showMembersOnMap();
      });
    }
  }

  showMembersOnMap() {
    if (this.map) {
      this.mDatas.circleMembers.forEach((member: Member) => {
        if (member.marker) {
          member.marker.setVisible(true);
        }
        else {
          if (member.location) {
            let markerOptions: MarkerOptions = {
              icon: "",//"data:image/png;base64," + this.imageToBase64(member.avatar),
              position: member.location.latLng,
              size: {
                width: 24,
                height: 24
              }
            }

            this.map.addMarker(markerOptions).then((marker: Marker) => {
              member.marker = marker;
            });
          }
        }
      });
    }
  }

  hideMembersOnMap() {
    this.mDatas.circleMembers.forEach(member => {
      if (member.marker) {
        member.marker.setVisible(false);
      }
    });
  }

  showRouteOnMap(steps: Array<Location>, withStep: boolean) {
    let latLngs = Utils.latLngsFromSteps(steps);
    let polylineOptions: PolylineOptions = {
      points: latLngs,
      color: "#20ACFF",
      width: 4
    }

    if (this.map) {
      if (withStep) {
        steps.forEach(step => {
          let markerOptions: MarkerOptions = {
            icon: ((steps.indexOf(step) == 0) || (steps.indexOf(step) == (steps.length - 1))) ? "./assets/imgs/route-start.png" : "./assets/imgs/route-point.png",
            position: step.latLng,
            size: {
              width: 20,
              height: 20
            }
          }

          this.map.addMarker(markerOptions).then((marker: Marker) => {
            this.mDatas.currentSteps.push(marker);
          });
        });
      }

      this.map.addPolyline(polylineOptions).then((polyline: Polyline) => {
        this.mDatas.currentRoute = polyline;
      });
    }
  }

  hideRouteOnMap() {
    if (this.mDatas.currentRoute) {
      this.mDatas.currentRoute.remove();
      this.mDatas.currentRoute = null;
    }

    if (this.mDatas.currentSteps.length > 0) {
      this.mDatas.currentSteps.forEach(step => {
        step.setVisible(false);
      });
      this.mDatas.currentSteps = [];
    }
  }


  onChangePageView() {
    if (!this.mDatas.isOnDetail) {
      // View thông tin vòng kết nối => View Chi tiết thành viên
      // *Todo: Ẩn Marker các thành viên
      //        Show thông tin của thành viên đang được view
      this.mDatas.isOnDetail = true;
      this.hideMembersOnMap();
    }
    else {
      // View Chi tiết thành viên => View thông tin vòng kết nối
      // *Todo: Ẩn thông tin của thành viên đang được view
      //        Show Marker các thành viên
      this.mDatas.isOnDetail = false;
      this.hideRouteOnMap()
      this.showMembersOnMap();
      this.mDatas.memberDetail = null;
    }
  }

  onUpdateCircleData(circle: Circle) {
    this.mDatas.circleId = circle.id;
    this.mDatas.circleName = circle.name;
    this.mDatas.circleMembers = circle.members;
    this.mDatas.circleNewMessages = 0;
  }

  /**
   * Hiển thị danh sách thành viên dưới Header
   */
  showMembersBar() {
    if (this.members && this.members.nativeElement.classList.contains("hidden")) {
      this.members.nativeElement.classList.remove("hidden");
    }

    if (this.members && this.members.nativeElement.classList.contains("hidden-members")) {
      setTimeout(() => {
        this.members.nativeElement.classList.remove("hidden-members");
      }, 400);
    }
  }

  /**
   * Ẩn danh sách thành viên dưới Header
   */
  hideMembersBar() {
    if (this.members && !this.members.nativeElement.classList.contains("hidden-members")) {
      this.members.nativeElement.classList.add("hidden-members");
    }

    if (this.members && !this.members.nativeElement.classList.contains("hidden")) {
      setTimeout(() => {
        this.members.nativeElement.classList.add("hidden");
      }, 400);
    }
  }

  showLoading() {
    this.mDatas.onLoading = true;
  }

  hideLoading() {
    this.mDatas.onLoading = false;
  }

  getMemberTrace(member: Member) {
    this.hideRouteOnMap();
    if (member.isPublic) {
      this.showLoading();

      this.mAwModule.getUserTraces(member.id, Utils.getRequestDate(this.mDatas.currentDateView)).then((data: Trace) => {
        this.mDatas.currentTrace = [];
        data.steps.forEach((step: Location) => {
          this.mDatas.currentTrace.push(step);
        });

        this.showRouteOnMap(this.mDatas.currentTrace, true);

        Utils.animateCameraTo(this.map, this.mDatas.currentTrace[0].latLng, 1000);
        this.hideLoading();
      });
    }
  }


  onClickMenu() {
    this.mMenuController.open();
  }

  onClickMore() {
    let action = this.mActionSheetController.create({
      title: "Tùy chọn",
      buttons: [{
        text: "Tạo mới lộ trình/địa điểm",
        handler: () => {
          this.navCtrl.push("AwCreateRoutePage");
        }
      }, {
        text: this.mDatas.isOnDetail ? "Vị trí thành viên" : "Lộ trình thành viên",
        handler: () => {
          if (!this.mDatas.isOnDetail) {
            this.onClickViewDetail();
          }
          else {
            this.onClickCloseViewDetail();
          }
        }
      }, {
        text: "Cài đặt chia sẻ",
        handler: () => {

        }
      }, {
        text: "Đo khoảng cách",
        handler: () => {

        }
      }, {
        text: "Rời vòng kết nối",
        role: "destructive",
        handler: () => {

        }
      }, {
        text: "Quay lại",
        role: "cancel",
        handler: () => {

        }
      }],
      enableBackdropDismiss: true
    });

    action.present();
  }

  onClickViewDetail() {
    if (this.mDatas.circleMembers.length > 0) {
      this.mDatas.memberDetail = this.mDatas.circleMembers[0];
      this.getMemberTrace(this.mDatas.memberDetail);
    }
    this.showMembersBar();
    this.onChangePageView();
    this.mMenuController.enable(false);
  }

  onClickCloseViewDetail() {
    this.hideMembersBar();
    this.onChangePageView();
    this.mMenuController.enable(true);
  }

  onClickMemberPosition(member: Member) {
    if (this.map && member.location) {
      Utils.animateCameraTo(this.map, member.location.latLng, 1000);
    }
  }

  onClickTitle() {
    console.log(this.imageToBase64("./assets/imgs/logo.png"));

  }

  onClickChangeMemberDetail(member: Member) {
    this.mDatas.memberDetail = member;
    this.getMemberTrace(member);
  }

  onClickDatePicker() {

  }

  onClickStep(step: Location) {
    Utils.animateCameraTo(this.map, step.latLng, 1000);
  }
}
