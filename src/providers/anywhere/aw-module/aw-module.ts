import { Utils } from '../../app-utils';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ChatBox } from './../aw-classes/chat-box';
import { Location, NotUploadYetLocation } from './../aw-classes/location';
import { TraceController } from './../aw-controller/trace-controller';
import { Events } from 'ionic-angular';
import { User } from './../aw-classes/user';
import { Circle, CircleBase } from './../aw-classes/circle';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import {
  Geocoder, GeocoderRequest, GeocoderResult,
  LatLng,
  Spherical,
  ILatLng
} from '@ionic-native/google-maps';

import { CircleController } from '../aw-controller/circle-controller';
import { Member } from '../aw-classes/member';
import { FirebaseModule } from '../firebase-module/firebase-module';
import { AngularFirestore } from 'angularfire2/firestore';
import { BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Trace } from '../aw-classes/trace';
import { Storage } from '@ionic/storage';

import { Md5 } from 'ts-md5/dist/md5';

import { Http } from '@angular/http';
import { AwSFSConnector } from '../sfs-module/sfs-connector';

@Injectable()
export class AwModule {

  private _mUser: User = new User("", "", "");

  private _mCircleController: CircleController;
  private _mTraceController: TraceController;
  private _mFirebaseModule: FirebaseModule;
  private _mSfsModule: AwSFSConnector;

  private MIN_TIME_REQUEST = 600000; // 30 minutes per step = 1800000
  private STATION_RADIUS = 300; // station radius in meters = 300
  private DISTANCE_FILTER = 500; // distance filter in meters = 500

  private notUploadYet: Array<NotUploadYetLocation> = []

  // for development
  public ISDEBUGGING = true;

  constructor(private mEvents: Events,
    private mAngularFirestore: AngularFirestore,
    private mBackgroundGeolocation: BackgroundGeolocation,
    private mDiagnostic: Diagnostic,
    public storage: Storage,
    private mHttp: Http,
    private mNetwork: Network) {
    this._mCircleController = new CircleController();
    this._mFirebaseModule = new FirebaseModule(mAngularFirestore);
    this._mTraceController = new TraceController(this._mFirebaseModule);
    if (!this.ISDEBUGGING) {
      this._mSfsModule = new AwSFSConnector();
    }
  }

  get user() {
    return this._mUser;
  }

  login(phonenumber: string, password: string, isMd5?: boolean) {    
    console.log("here");
    
    return new Promise((res, rej) => {
      if (this.ISDEBUGGING) {
        console.log("hereeeee");
        // test: phonenumber: 0987654321 - password: 123456
        setTimeout(() => {
          if ((phonenumber == "0987654321")
            || (phonenumber == "01234567899")
            || (phonenumber == "0987654322")) {
            if (isMd5 || password == "123456") {
              this._mUser = new User(phonenumber, phonenumber, "./assets/imgs/logo.png")
              this.fakeUser();

              this.uploadSavedSteps();
              this.saveUserInfoToStorage(phonenumber, password);

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
      }
      else {
        this._mSfsModule.login(phonenumber, password, isMd5).then(loginResponse => {
          // thiếu: get User data

          // this.uploadSavedSteps();
          // this.saveUserInfoToStorage(phonenumber, password);

          // Publish event update user's info to update Menu's data
          this.mEvents.publish("user: changed", this._mUser);

          res(loginResponse);
        });
      }
    });
  }

  private uploadSavedSteps() {
    // get tracked locations, filter and upload datas to Server
    this.mBackgroundGeolocation.getLocations().then((locations: Array<BackgroundGeolocationResponse>) => {
      // timestamp location cuối cùng được duyệt trong locations của Plugin
      // là timestamp của location upload thành công cuối cùng
      // hoặc timestamp của location cuối cùng đang lưu trong Storage (nếu có)
      let realLastLocation: NotUploadYetLocation = null;
      console.log("full locations: ", locations);

      this.storage.get("last-upload-location").then(data => {

        console.log("last-upload-location: ", data);
        let lastLocation = JSON.parse(data);
        console.log("lastLocation: ", lastLocation);

        if (lastLocation != null) {
          realLastLocation = new NotUploadYetLocation(lastLocation._address, lastLocation._lat, lastLocation._lng, lastLocation._time);
          realLastLocation.setUserId(lastLocation.userId);
        }

        this.storage.get("not-upload-locations-yet").then(data => {
          console.log("not-upload-locations-yet: ", data);
          let steps = JSON.parse(data);

          if (steps) {
            for (let i = 0; i < steps.length; i++) {
              let step = new NotUploadYetLocation(steps[i]._address, steps[i]._lat, steps[i]._lng, steps[i]._time);
              step.setUserId(steps[i].userId);
              this.notUploadYet.push(steps[i]);
            }
          }

          // Mảng này sẽ không quá lớn => Sắp xếp tăng dần theo "time"
          // Thay cho việc phải duyệt xuôi tất cả location trong Plugin ở bước sau.
          this.arrangeNotUploadLocations();

          console.log("after storage", this.notUploadYet);


          // location cuối cùng trong Storage sẽ nằm cuối cùng
          if (this.notUploadYet.length > 0) {
            realLastLocation = this.notUploadYet[this.notUploadYet.length - 1];
          }


          if (locations.length > 0) {

            let firstCheckIndex = locations.length - 1;
            let firstLocation = new NotUploadYetLocation("", locations[firstCheckIndex].latitude, locations[firstCheckIndex].longitude, locations[firstCheckIndex].time);
            // Check nhẹ xem có cần duyệt đám locations trong Plugins ko?
            if ((realLastLocation && (realLastLocation.userId != this._mUser.id))
              || (this.isValidLocation(firstLocation, realLastLocation))) {
              firstLocation.setUserId(this._mUser.id);
              this.notUploadYet.push(firstLocation);
              firstCheckIndex = locations.length - 2;

              console.log("---MIN_TIME_REQUEST: ", this.MIN_TIME_REQUEST);

              for (let i = firstCheckIndex; i > 0; i--) {
                let onCalculate = new NotUploadYetLocation("", locations[i].latitude, locations[i].longitude, locations[i].time);;

                if ((realLastLocation == null) || (onCalculate.time > realLastLocation.time)) {

                  let preLocation = this.notUploadYet[this.notUploadYet.length - 1];
                  if (this.isValidLocation(onCalculate, preLocation)) {

                    onCalculate.setUserId(this._mUser.id);
                    console.log("Được: ", onCalculate);

                    this.notUploadYet.push(onCalculate);

                    if (i == 1) {
                      let niceLocation = new NotUploadYetLocation("", preLocation.latLng.lat, preLocation.latLng.lng, preLocation.time)
                      niceLocation.setUserId(this._mUser.id);
                      this.notUploadYet.push(niceLocation);
                    }
                  }
                }

                else {
                  // Do các location trong Plugin được xếp tăng dần
                  // => duyệt ngược đến giá trị timestamp là ok
                  break;
                }
              }
            }
            else {
              console.log("Login gần nhau quá");

            }

            this.arrangeNotUploadLocations();
            console.log("Trước khi upload: ", this.notUploadYet);
            this.upLoadLocations();
          }
        });
      });
    });
  }

  arrangeNotUploadLocations() {
    for (let i = 0; i < this.notUploadYet.length - 1; i++) {
      for (let j = i + 1; j < this.notUploadYet.length; j++) {
        if (this.notUploadYet[i].time > this.notUploadYet[j].time) {
          let temp = this.notUploadYet[i];
          this.notUploadYet[i] = this.notUploadYet[j];
          this.notUploadYet[j] = temp;
        }
      }
    }
  }

  /**
   * Upload đám location chưa đc upload
   */
  private upLoadLocations() {
    // Có Network => Check danh sách
    //               => Có => push
    //               => Không => done => remove from storage
    // Không => Lưu danh sách lại 

    if (this.mNetwork.type != "none") {
      if (this.notUploadYet.length > 0) {
        let i = 0;
        let location = this.notUploadYet[i];

        this.pushNewBackgroundLocation(location.userId, location).then(() => {
          this.notUploadYet.splice(i, 1);
          this.upLoadLocations();
        }).catch(e => {
          this.storage.set('not-upload-locations-yet', JSON.stringify(this.notUploadYet));
        });
      }
      else {
        this.storage.remove("not-upload-locations-yet");
      }
    }
    else {
      this.storage.set('not-upload-locations-yet', JSON.stringify(this.notUploadYet));
    }

  }

  /**
   * Điều kiện upload: DeltaT > MIN_TIME_REQUEST(30p) và distanceBtwn > STATION_RADIUS(300m)
   */
  isValidLocation(onCheckLocation: Location, preLocation: Location) {
    console.log("isValidLocation: ", onCheckLocation, preLocation);

    if (preLocation) {
      let deltaTime = Math.abs(onCheckLocation.time - preLocation.time);
      let distanceBtwn = Spherical.computeDistanceBetween(
        new LatLng(onCheckLocation.latLng.lat, onCheckLocation.latLng.lng),
        new LatLng(preLocation.latLng.lat, preLocation.latLng.lng)
      );
      console.log("check Điều kiện:", deltaTime, distanceBtwn);

      return ((deltaTime >= this.MIN_TIME_REQUEST) && (distanceBtwn >= this.STATION_RADIUS))
    }
    else {
      return true;
    }
  }

  // for test
  fakeLogin() {
    return this.login("0987654321", "123456");
  }

  logOut() {
    return new Promise((res, rej) => {
      setTimeout(() => {
        this.removeUserInfoInStorage();
        this.stopBackgroundGeolocation();
        res();
      }, 1000);
    });
  }

  signUp(phonenumber: string, password: string, otp: string) {
    console.log("sign up: ", phonenumber, password);

    if (this.ISDEBUGGING) {
      // request sign up
      // test: phonenumber: 0987654321 - password: 123456
      return new Promise((res, rej) => {
        setTimeout(() => {
          if ((phonenumber == "0987654321") || (phonenumber == "01234567899")) {
            res({ success: 0, msg: "SĐT này đã đăng ký" });
          }
          else {
            this.fakeUser();

            // Publish event update user's info to update Menu's data
            this.mEvents.publish("user: changed", this._mUser);

            res({ success: 1, msg: "Đăng ký thành công" });
          }
        }, 1000);
      });
    }
    else {
      this._mSfsModule.signUp(phonenumber, password, otp)
    }
  }

  getNewConnectCode() {
    this.user.resetDynamicCode();

    return new Promise((res, rej) => {
      setTimeout(() => {
        this.user.dynamicCode = "new" + Math.floor((Math.random() * 999) + 100);
        res();
      }, 1000);
    });
  }


  fakeUser() {
    let address = new Location("1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội", 21.007085, 105.842882, 0);
    let circle1 = new CircleBase("c0001", "Bạn bè", "u00001");
    let circle2 = new CircleBase("c0002", "Demo", "0987654321");

    this._mUser.home = address;
    this._mUser.staticCode = "jqk123";
    this._mUser.dynamicCode = "dynamic";

    this._mUser.addCircle(circle1);
    this._mUser.addCircle(circle2);
  }

  onFirstTime() {
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

  requestJoinCircle(code: string) {
    return new Promise((res, rej) => {
      setTimeout(() => {

        let circle = new CircleBase("c000" + (this._mUser.circles.length + 1), "Đồng Nghiệp", "u00002");

        this._mUser.addCircle(circle);

        this.mEvents.publish("circle: changed", circle.id);
        this.mEvents.publish("circleId: changed", circle.id);

        res();
      }, 2000);
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

  //------------------------------------Location Permission---------------------

  checkLocationPermission() {
    return new Promise((res, rej) => {
      this.mDiagnostic.isLocationAvailable().then(available => {
        if (!available) {
          this.mDiagnostic.requestLocationAuthorization().then(status => {
            if (status == this.mDiagnostic.permissionStatus.GRANTED || status == this.mDiagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
              res(true);
            }
            else {
              res(false);
            }
          }).catch(e => { rej(); });
        }
        else {
          res(true);
        }
      }).catch(e => { });
    });
  }

  checkGPSPermission() {
    return new Promise((res, rej) => {
      this.mDiagnostic.isGpsLocationAvailable().then(available => {
        if (!available) {
          res(false);
        }
        res(true);
      });
    });
  }

  switchToLocationSettings() {
    this.mDiagnostic.switchToLocationSettings();
  }

  //------------------------------------Background Geolocation---------------------
  setUpBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      locationProvider: 0,
      desiredAccuracy: 10,
      stationaryRadius: this.STATION_RADIUS,
      distanceFilter: this.DISTANCE_FILTER,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval: this.MIN_TIME_REQUEST,
      notificationTitle: 'Anywhere is currently tracking!',
    };

    this.mBackgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        // this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });

    this.mBackgroundGeolocation.start().then(() => {
      console.log("this.backgroundGeolocation.start success");
    });
  }

  logBackgroundLocations() {
    this.mBackgroundGeolocation.getLocations().then(data => {
      console.log("logBackgroundLocations", data);
    });
  }

  stopBackgroundGeolocation() {
    this.mBackgroundGeolocation.stop();
  }

  //------------------------------------Firebase---------------------
  getLastestStep(userId: string, date: Date) {
    return new Promise((res, rej) => {
      let tempReq = this.getUserTraces(userId, Utils.getRequestDate(new Date())).subscribe((data: Trace) => {
        tempReq.unsubscribe();

        if (data.steps.length > 0) {
          res(data.steps[data.steps.length - 1]);
        }
        else {
          res(null);
        }
      });
    });
  }

  pushNewBackgroundLocation(userId: string, location: Location) {
    return new Promise((res, rej) => {
      let trackedLocation = new Location("", location.latLng.lat, location.latLng.lng, location.time)
      this._mFirebaseModule.pushLocation(userId, Utils.getRequestDate(new Date(location.time)), trackedLocation).then(() => {
        this.storage.set("last-upload-location", JSON.stringify(location));

        res();
      });
    });
  }

  //------------------------------------Storage---------------------
  /*
   * Danh sách Key trong Storage
   * 1. phonenumber: Phonenumber người dùng
   * 2. password: Password MD5 của người dùng
   * 3. not-upload-locations-yet: Danh sách các Step chưa được up lên Server
   * 4. last-upload-location: Location cuối cùng up thành công lên Server
   *  (= null trong lần đầu tiên sử dụng ứng dụng)
   */

  saveUserInfoToStorage(phonenumber: string, password: string) {
    console.log("saveee");
    
    this.storage.set('phonenumber', phonenumber);
    this.storage.set('password', Md5.hashStr(password));
  }

  removeUserInfoInStorage() {
    this.storage.remove("phonenumber");
    this.storage.remove("password");
    this.storage.remove("not-upload-locations-yet");
  }

  getLastestUserDataFromStorage() {
    return new Promise((res, rej) => {
      this.storage.get("phonenumber").then(phonenumber => {
        if (phonenumber) {
          this.storage.get("password").then(password => {
            if (password) {
              res({ "phonenumber": phonenumber, "password": password })
            }
            else {
              res(null);
            }
          });
        }
        else {
          res(null);
        }
      });
    })
  }

  //------------------------------------Smartfox Server---------------------

  getOtp(phonenumber: string) {
    return this._mSfsModule.getOtp(phonenumber);
  }

  tryToSignUp() {
    return new Promise((res, rej) => {
      this._mSfsModule.login("", "").then(() => {
        res();
      });
    })
  }
}
