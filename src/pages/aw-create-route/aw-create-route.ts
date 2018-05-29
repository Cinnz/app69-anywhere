import { LatLng } from '@ionic-native/google-maps';
import { Utils } from './../../providers/app-utils';
import { AwModule } from './../../providers/anywhere/aw-module/aw-module';
import { Location } from './../../providers/anywhere/aw-classes/location';
import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController,
  ActionSheetController, Picker,
  AlertController,
  App,
  PickerOptions,
  PickerColumn,
  Config,
  MenuController
} from 'ionic-angular';
import {
  LocationService,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  GoogleMap,
  ILatLng,
  PolylineOptions,
  MarkerOptions,
  Marker,
  Polyline
} from '@ionic-native/google-maps';

export class LocationWithMarker {
  private _location: Location;
  private _marker: Marker;

  constructor(location: Location) {
    this._location = location;
  }

  get location() {
    return this._location;
  }

  set marker(marker: Marker) {
    this._marker = marker;
  }

  get marker() {
    return this._marker;
  }
}

@IonicPage()
@Component({
  selector: 'page-aw-create-route',
  templateUrl: 'aw-create-route.html',
})
export class AwCreateRoutePage {
  @ViewChild('routeContainer') routeContainer: ElementRef;
  map: GoogleMap;

  mTexts = {
    title: "Lộ trình",
    titleStart: "Điểm xuất phát",
    titleEnd: "Đích đến",
    checkPoint: "Checkpoint",
    search: "Tìm kiếm",
    addButton: "Thêm",
    reorderButton: "Reorder",
    saveButton: "Lưu",
    cancelButton: "Hủy",
    doneButton: "Xong",
    empty: "Chưa có lộ trình"
  }

  mDatas: {
    route: Array<LocationWithMarker>,
    isOnAddStep: boolean,
    tempStep: Location,
    isOnReorder: boolean,
    isShowingDatePicker: boolean,
    polyline: Polyline
  } = {
      route: [],
      isOnAddStep: false,
      tempStep: null,
      isOnReorder: false,
      isShowingDatePicker: false,
      polyline: null,
    }

  constructor(public navCtrl: NavController,
    private mPlatform: Platform,
    private mModalController: ModalController,
    private mAlertController: AlertController,
    private mMenuController: MenuController,
    private mApp: App,
    private mActionSheetController: ActionSheetController,
    private mChangeDetectorRef: ChangeDetectorRef,
    private mAwModule: AwModule,
    public navParams: NavParams) {
    // let a = new LocationWithMarker(new Location("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", 0, 0, 1526831580000))
    // a.location.title = "BlueGym Võ Thị Sáu Hà Nội"
    // let b = new LocationWithMarker(new Location("BBBBBBBBBBBBBBBBBB", 0, 0, 1526835180000))
    // this.mDatas.route.push(a, b);
  }

  ionViewDidEnter() {
    this.mPlatform.ready().then(() => {
      if (this.mPlatform.is('android') || this.mPlatform.is('ios')) {
        this.loadMap();
      }
    });
  }

  ionViewWillLeave() {
    if (this.map) {
      this.map.remove();
    }
  }

  loadMap() {
    if (this.map) {
      this.map.remove().then(() => {
        this.loadMap();
      });
    }
    else {
      let mapElement = document.getElementById("map-route");

      LocationService.getMyLocation({ enableHighAccuracy: true }).then(location => {
        let mapOption: GoogleMapOptions = {
          mapType: 'MAP_TYPE_ROADMAP',
          controls: {
            compass: true,
            myLocation: true,
            myLocationButton: false,
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

        this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(() => {
          if (this.mDatas.isOnAddStep) {
            this.onMapViewChanged(this.map.getCameraTarget());
          }
        });

        this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
          if (this.mDatas.isOnAddStep) {
            this.onMapViewChanged(this.map.getCameraTarget());
          }
        });
      });
    }
  }

  showRouteOnMap(steps: Array<LocationWithMarker>) {

    if (steps.length > 0) {
      let latLngs: Array<LatLng> = [];

      steps.forEach(step => {
        latLngs.push(step.location.latLng);
      });

      let polylineOptions: PolylineOptions = {
        points: latLngs,
        color: "#20ACFF",
        width: 4
      }

      this.map.addPolyline(polylineOptions).then(polyline => {
        this.mDatas.polyline = polyline;
      });
    }
  }

  hideRouteOnMap() {
    if (this.mDatas.polyline) {
      this.mDatas.polyline.remove();
      this.mDatas.polyline = null;
    }
  }

  addStepOnMap(step: LocationWithMarker, isCheckPoint: boolean) {
    let markerOptions: MarkerOptions = {
      icon: isCheckPoint ? "./assets/imgs/route-point.png" : "./assets/imgs/route-start.png",
      position: step.location.latLng,
      anchor: [10, 10],
      size: {
        width: 20,
        height: 20
      }
    }

    this.map.addMarker(markerOptions).then((marker: Marker) => {
      step.marker = marker;
    });
  }

  removeStepOnMap(step: LocationWithMarker) {
    let index = this.mDatas.route.indexOf(step);

    step.marker.remove();
    this.mDatas.route.splice(index, 1);
  }

  showStepsOnMap(steps: Array<LocationWithMarker>) {
    if (this.map) {
      steps.forEach(step => {
        let markerOptions: MarkerOptions = {
          icon: ((steps.indexOf(step) == 0) || (steps.indexOf(step) == (steps.length - 1))) ? "./assets/imgs/route-start.png" : "./assets/imgs/route-point.png",
          position: step.location.latLng,
          anchor: [10, 10],
          size: {
            width: 20,
            height: 20
          }
        }

        this.map.addMarker(markerOptions).then((marker: Marker) => {
          step.marker = marker;
        });
      });
    }
  }

  hideStepsOnMap() {
    if (this.mDatas.route.length > 0) {
      this.mDatas.route.forEach(step => {
        step.marker.setVisible(false);
      });
    }
  }

  removeStepsOnMap() {
    if (this.mDatas.route.length > 0) {
      this.mDatas.route.forEach(step => {
        step.marker.remove();
      });
    }
  }

  removeSteps() {
    this.mDatas.route = [];
  }

  setData(address: string, location: ILatLng, move?: boolean) {
    this.mDatas.tempStep = new Location(address, location.lat, location.lng, new Date().getTime());

    if (move) {
      this.map.setCameraTarget(location);
    }
  }

  resetTempStep() {
    this.mDatas.tempStep = null;
  }

  onMapViewChanged(location: ILatLng) {
    this.mAwModule.requestAddress(location).then((address: string) => {
      if (address && address.length > 0) {
        this.setData(address, this.map.getCameraTarget());
      }
      else {
        this.resetTempStep();
      }

      this.mChangeDetectorRef.detectChanges();
    }).catch(e => {
      this.resetTempStep();
    });
  }

  reorderItems(indexes) {
    let element = this.mDatas.route[indexes.from];
    this.mDatas.route.splice(indexes.from, 1);
    this.mDatas.route.splice(indexes.to, 0, element);
  }

  scrollRouteToTop() {
    if (this.routeContainer) {
      this.routeContainer.nativeElement.scrollTop = 0;
    }
  }

  onSaveRoute() {
    console.log(this.mDatas.route);

  }

  onShowDatePicker() {
    let pickerColumnMonth: PickerColumn = {
      columnWidth: "144px",
      name: "month",
      options: [
        { text: "January", value: 1 },
        { text: "February", value: 2 },
        { text: "March", value: 3 },
        { text: "April", value: 4 },
      ],
      selectedIndex: 0
    }
    let pickerColumnYear: PickerColumn = {
      columnWidth: "144px",
      name: "year",
      options: [
        { text: "2017", value: 2017 },
        { text: "2018", value: 2018 },
        { text: "2019", value: 2019 },
        { text: "2020", value: 2020 },
      ],
      selectedIndex: 0
    }
    let pickerOptions: PickerOptions = {
      buttons: [],
      columns: [pickerColumnMonth, pickerColumnYear]
    }
    let config = new Config();
    config.init("pickerEnter", this.mPlatform);
    let mPicker = new Picker(this.mApp, pickerOptions, config);

    mPicker.present().then(data => {
      console.log(data);
    });
  }

  onPressStep(step: LocationWithMarker) {
    let alert = this.mAlertController.create({
      title: 'Thông tin địa điểm',
      message: step.location.address,
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            step.location.title = data.title;
          }
        }
      ]
    });

    alert.present();
  }

  onClickTitle() {
    this.onShowDatePicker();
  }

  onClickSearch() {
    let modal = this.mModalController.create("SearchAddressPage");

    modal.onWillDismiss((data) => {
      this.resetTempStep();
      if (data && data['address']) {
        this.mAwModule.requestLatLng(data['address']).then((location: ILatLng) => {
          this.setData(data['address'], location, true);
        });
      }
    })
    modal.present();
  }

  onClickAddStep() {
    this.mDatas.isOnAddStep = true;
    this.hideRouteOnMap();
    this.onMapViewChanged(this.map.getCameraTarget());
  }

  onClickReorder() {
    this.mDatas.isOnReorder = true;
    this.scrollRouteToTop();
    this.hideRouteOnMap();
  }

  onClickSaveStep() {
    let location = new Location(this.mDatas.tempStep.address, this.mDatas.tempStep.latLng.lat, this.mDatas.tempStep.latLng.lng, this.mDatas.tempStep.time);
    let step = new LocationWithMarker(location);
    let currentStepsNumber = this.mDatas.route.length;

    if (currentStepsNumber < 2) {
      this.mDatas.route.push(step);
      this.addStepOnMap(step, false);
    }
    else {
      this.mDatas.route.splice(currentStepsNumber - 1, 0, step);
      this.addStepOnMap(step, true);
    }

    this.mDatas.isOnAddStep = false;
    this.resetTempStep();
    this.showRouteOnMap(this.mDatas.route);
  }

  onClickCancel() {
    this.mDatas.isOnAddStep = false;
    this.showRouteOnMap(this.mDatas.route);
  }

  onClickDoneReorder() {
    this.mDatas.isOnReorder = false;
    this.scrollRouteToTop();

    this.removeStepsOnMap();
    this.showStepsOnMap(this.mDatas.route);
    this.showRouteOnMap(this.mDatas.route);
  }

  onClickStep(step: LocationWithMarker) {
    console.log(step);

    Utils.animateCameraTo(this.map, step.location.latLng, 1000);
  }

  onClickMore() {
    let action = this.mActionSheetController.create({
      title: "Tùy chọn",
      buttons: [{
        text: "Lưu lại",
        handler: () => {
          this.onSaveRoute();
          this.navCtrl.pop();
        }
      }, {
        text: "Đảo ngược lộ trình",
        handler: () => {
          this.hideRouteOnMap();
          this.hideStepsOnMap();

          this.mDatas.route.reverse();
          this.showStepsOnMap(this.mDatas.route);
          this.showRouteOnMap(this.mDatas.route);
        }
      }],
      enableBackdropDismiss: true
    });

    action.present();
  }

  onClickClose() {
    let alert = this.mAlertController.create({
      title: 'Bạn muốn lưu lộ trình này?',
      buttons: [
        {
          text: 'Thoát',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Lưu',
          handler: () => {
            this.onSaveRoute();
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

  editingStep: LocationWithMarker;
  editingTime: Date;
  onClickChangeTime(step: LocationWithMarker) {
    this.mMenuController.enable(false);
    this.editingStep = step;
    this.editingTime = new Date(step.location.time);
    this.mDatas.isShowingDatePicker = true;
  }

  onCancelDatePicker() {
    this.mDatas.isShowingDatePicker = false;
    this.mMenuController.enable(true);
  }

  onDatePickerChanged(data) {
    let newTime = new Date(data['year'], data['month'] - 1, data['date'], data['hour'], data['minute']);

    this.mDatas.isShowingDatePicker = false;
    this.editingStep.location.time = newTime.getTime();
    this.mMenuController.enable(true);
  }
}
