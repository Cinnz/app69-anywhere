import { Location } from './../../providers/aw-classes/location';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LocationService, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, GoogleMap } from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-aw-create-route',
  templateUrl: 'aw-create-route.html',
})
export class AwCreateRoutePage {
  map: GoogleMap;

  mTexts = {
    title: "Lộ trình",
    addButton: "Thêm",
    reorderButton: "Reorder"
  }

  mDatas: {
    routes: Array<Location>
  } = {
      routes: []
    }

  constructor(public navCtrl: NavController,
    private mPlatform: Platform,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.mPlatform.ready().then(() => {
      if (this.mPlatform.is('android') || this.mPlatform.is('ios')) {
        this.loadMap();
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
      });
    }
  }

  onClickAddStep() {
    this.navCtrl.push("AwCreateLocationPage");
  }
}
