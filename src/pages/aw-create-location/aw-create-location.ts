import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import {
  GoogleMaps, GoogleMap, GoogleMapOptions,
  LocationService,
  GoogleMapsEvent,
  ILatLng,
} from '@ionic-native/google-maps';

import { AwModule } from './../../providers/aw-module/aw-module';


@IonicPage()
@Component({
  selector: 'page-aw-create-location',
  templateUrl: 'aw-create-location.html',
})
export class AwCreateLocationPage {
  map: GoogleMap;

  mTexts = {
    title: "Chọn vị trí nhà bạn",
    search: "Tìm kiếm",
    next: "Tiếp theo"
  }

  mDatas = {
    address: "",
    location: null,
    isSignUp: true
  }

  constructor(public navCtrl: NavController,
    private mAwModule: AwModule,
    private mChangeDetectorRef: ChangeDetectorRef,
    private mPlatform: Platform,
    private mModalController: ModalController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.mPlatform.ready().then(() => {
      if (this.mPlatform.is('android') || this.mPlatform.is('ios')) {
        // this.loadMap();
      }

    });
  }

  ionViewDidLeave(){
    if(this.map){
      this.map.remove();
    }
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

        this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(() => {
          this.onMapViewChanged(this.map.getCameraTarget());
        });

        this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
          this.onMapViewChanged(this.map.getCameraTarget());
        });
      });
    }
  }

  onMapViewChanged(location: ILatLng) {
    this.mAwModule.requestAddress(location).then((address: string) => {
      if (address && address.length > 0) {
        this.setData(address, this.map.getCameraTarget());
      }
      else {
        this.resetData();
      }

      this.mChangeDetectorRef.detectChanges();
    }).catch(e => {
      this.resetData();
    });
  }

  resetData() {
    this.mDatas.address = "";
    this.mDatas.location = null
  }

  setData(address: string, location: ILatLng, move?: boolean) {
    this.mDatas.address = address;
    this.mDatas.location = location;

    if (move) {
      this.map.setCameraTarget(this.mDatas.location);
    }
  }

  onClickNext() {
    this.navCtrl.push("AwCreateCirclePage", { isSignUp: true });
  }

  onClickSearch() {
    let modal = this.mModalController.create("SearchAddressPage");

    modal.onWillDismiss((data) => {
      this.resetData();
      if (data && data['address']) {
        this.mAwModule.requestLatLng(data['address']).then((location: ILatLng) => {
          this.setData(data['address'], location, true);
        });
      }
    })

    modal.present();
  }

}
