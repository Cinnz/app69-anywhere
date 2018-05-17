import { ChatBox } from './../aw-classes/chat-box';
import { Location } from './../aw-classes/location';
import { TraceController } from './../aw-controller/trace-controller';
import { Events } from 'ionic-angular';
import { User } from './../aw-classes/user';
import { Circle, CircleBase } from './../aw-classes/circle';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
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

  constructor(private mEvents: Events,
    private mNetwork: Network) {
  }

  get user() {
    return this._mUser;
  }

  login(phonenumber: string, password: string) {
    console.log("on Login: ", phonenumber + " - " + password);

    // request Login
    // test: phonenumber: 0987654321 - password: 123456
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (phonenumber == "0987654321") {
          if (password == "123456") {
            this.fakeUser();

            // Publish event update user's info to update Menu's data
            this.mEvents.publish("user: changed", this._mUser);
            res({ success: 1 });
          }
          else {
            res({ success: 0, msg: "Mật khẩu không đúng" });
          }
        } else {
          res({ success: 0, msg: "SĐT chưa đăng ký" });
        }
      }, 1000);
    });
  }

  signUp(phonenumber: string, password: string) {
    console.log("sign up: ", phonenumber, password);

    // request sign up
    // test: phonenumber: 0987654321 - password: 123456
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (phonenumber == "0987654321") {
          res({ success: 0, msg: "SĐT này đã đăng ký" });
        }
        else {
          this.fakeUser();

          // Publish event update user's info to update Menu's data
          this.mEvents.publish("user: changed", this._mUser);

          res({ success: 1, msg: "Đăng ký thành công"});
        }
      }, 1000);
    });
  }

  fakeUser() {
    let address = new Location("1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội", 21.007085, 105.842882, 0);
    let circle1 = new CircleBase("c0001", "Bạn bè", "u00001");
    let circle2 = new CircleBase("c0002", "Gia đình", "u00002");

    this._mUser = new User("u00001", "Hoài Nam", "./assets/imgs/logo.png");
    this._mUser.home = address;

    this._mUser.addCircle(circle1);
    this._mUser.addCircle(circle2);
  }

  onFirstTime() {
    console.log("ON FIRST TIME");

    if (this._mUser.circles.length > 0) {
      this.mEvents.publish("circle: changed", this._mUser.circles[0].id)
    }
  }

  subscribeNetworkDisconnected() {
    let disconnectSubscription = this.mNetwork.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.subscribeNetworkConnected();
    });
  }

  subscribeNetworkConnected() {
    let connectSubscription = this.mNetwork.onConnect().subscribe(() => {
      console.log('network connected!', this.mNetwork.type);
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        connectSubscription.unsubscribe();
        if (this.mNetwork.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
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

  getCircleChatById(circleId: string): ChatBox {
    return;
  }

}
