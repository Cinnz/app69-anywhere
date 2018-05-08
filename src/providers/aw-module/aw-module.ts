import { User } from './../aw-classes/user';
import { Circle } from './../aw-classes/circle';
import { Injectable } from '@angular/core';

import {
  Geocoder, GeocoderRequest, GeocoderResult,
  LatLng,
  ILatLng
} from '@ionic-native/google-maps';

import { CircleController } from '../aw-controller/circle-controller';


@Injectable()
export class AwModule {

  private _mCircleController = new CircleController()

  constructor() {
  }

  requestAddress(location: ILatLng) {
    return new Promise((res, rej) => {
      let geoRequest: GeocoderRequest = {
        position: location
      }

      Geocoder.geocode(geoRequest).then((data: GeocoderResult[]) => {
        if (data && data.length > 0 && data[0]['extra'].lines.length > 0) {
          let address = data[0]['extra'].lines[0];
          res(address);
        }
        res();
      }).catch(err => {
        rej();
      });
    }).catch(e => {
      console.log(e);
    });;
  }

  requestLatLng(address: string) {
    return new Promise((res, rej) => {
      let geoRequest: GeocoderRequest = {
        address: address
      }

      Geocoder.geocode(geoRequest).then((data: GeocoderResult[]) => {
        if (data && data.length > 0 && data[0]['position']) {
          let location = new LatLng(data[0]['position'].lat, data[0]['position'].lng);

          res(location);
        }
      }).catch(err => {
        rej();
      });
    }).catch(e => {
      console.log(e);
    });
  }

  createNewCircle(circleName: string) {
    // let newCircle = new Circle()
  }

  getTrace(userId: string, date: Date) {

  }

  getCircle(circleId: string){
    return this._mCircleController.getCircle(circleId);
  }

}
