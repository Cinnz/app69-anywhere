import { TraceController } from './../aw-controller/trace-controller';
import { Events } from 'ionic-angular';
import { User } from './../aw-classes/user';
import { Circle, CircleBase } from './../aw-classes/circle';
import { Injectable } from '@angular/core';

import {
  Geocoder, GeocoderRequest, GeocoderResult,
  LatLng,
  ILatLng
} from '@ionic-native/google-maps';

import { CircleController } from '../aw-controller/circle-controller';
import { Member } from '../aw-classes/member';


@Injectable()
export class AwModule {

  private _mUser: User = new User("", "", "");

  private _mCircleController = new CircleController()
  private _mTraceController = new TraceController();

  constructor(private mEvents: Events) {
  }

  get user() {
    return this._mUser;
  }

  login(username: string, password: string) {
    console.log("on Login: ", username + " - " + password);

    // request Login

    return new Promise((res, rej) => {
      setTimeout(() => {
        this._mUser = new User("u00001", "Hoài Nam", "./assets/imgs/logo.png");

        let circle1 = new CircleBase("c0001", "Bạn bè", "u00001");
        let circle2 = new CircleBase("c0002", "Gia đình", "u00002");

        this._mUser.addCircle(circle1);
        this._mUser.addCircle(circle2);

        // Publish event update user's info to update data in Menu
        this.mEvents.publish("user: changed", this._mUser)
        res();
      }, 1000);
    });
  }

  onFirstTime() {
    console.log("ON FIRST TIME");
    
    if (this._mUser.circles.length > 0) {
      this.mEvents.publish("circle: changed", this._mUser.circles[0].id)
    }
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

  getUserTraces(userId: string, date: string) {
    return this._mTraceController.getTraceByDate(userId, date);
  }

  getCircleById(circleId: string) {
    return this._mCircleController.getCircle(circleId);
  }



}
