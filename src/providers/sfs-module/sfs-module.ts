import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

declare var SFS2X;

@Injectable()
export class SfsModule {

  secret = "9ACC22D8B0595EE06CDC8ACB5460560D";

  mSFSClient = null;
  mDebug = true;
  isConnected = false;
  isLoggedIn = false;

  constructor() {
  }

  init() {
    var anywhereConfig = {
      host: "192.168.2.176",
      port: 8887,
      zone: "AnywhereZone",
      debud: true,
      useSSL: false
    }

    // Create SmartFox client instance
    this.mSFSClient = new SFS2X.SmartFox(anywhereConfig);

    // Set logging
    this.mSFSClient.logger.level = SFS2X.LogLevel.DEBUG;
    this.mSFSClient.logger.enableConsoleOutput = true;
    this.mSFSClient.logger.enableEventDispatching = false;

    // Add event listeners
    this.mSFSClient.addEventListener(SFS2X.SFSEvent.CONNECTION, this.onConnection, this)

  }

  /**Khi thiết lập được kết nối, làm một số việc linh tinh ...*/
  private onConnection() {
    console.log(this.mSFSClient);
    this.SFSLog("on Connection success");
    this.isConnected = true;
  }

  public SFSLog(message) {
    if (!this.mDebug) return;
    console.log("SFS : " + message);
  }

  connect() {
    this.init();
    return new Promise((res, rej) => {
      //Connect to smartfox server
      this.mSFSClient.connect();
      this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, () => { });
      this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION, () => { });

      //If connect lost
      this.mSFSClient.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, (eventParams) => {
        this.SFSLog("on connection " + JSON.stringify(eventParams));
        this.onConnectionLost(eventParams.reason);
        res("Ngắt kết nối smartfox" + eventParams.reason);
      });
      //If connect success
      this.mSFSClient.addEventListener(SFS2X.SFSEvent.CONNECTION, (eventParams) => {
        this.SFSLog("on connection " + JSON.stringify(eventParams));
        if (eventParams.success) {
          this.onConnection();
          res("connect success");
        } else {
          rej("Không thể kết nối tới server");
        }
      });
    });
  }

  public _Disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.isConnected || !this.mSFSClient) {
        return resolve();
      } else {
        this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, () => { });
        this.mSFSClient.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, (reason) => {
          return resolve();
        });
        this.mSFSClient.disconnect();
      }
    });
  }

  protected onConnectionLost(reason: string) {
    this.SFSLog("on Connection Lost with reason " + reason);
    this.isConnected = false;
    this.isLoggedIn = false;
    this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION, () => { });
    this.mSFSClient.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, () => { });
    this.mSFSClient = null;
  }

  login(phonenumber: string, password: string, isMd5?: boolean) {
    return new Promise((res, rej) => {
      let md5Password = isMd5 ? password : Md5.hashStr(password);
      if (!phonenumber && !password) {
        // Fake Login to sign up
        this.mSFSClient.send(new SFS2X.LoginRequest());
      }
      else {
        // Disconnect => Connect => Login
        this._Disconnect().then(() => {
          this.connect().then(() => {
            let params = new SFS2X.SFSObject();

            params.putUtfString("phonenumber", phonenumber);
            params.putUtfString("password", md5Password);
            params.putUtfString("sign", Md5.hashStr(phonenumber + this.secret + md5Password));

            this.mSFSClient.removeEventListener(SFS2X.SFSEvent.LOGIN, () => { });
            this.mSFSClient.addEventListener(SFS2X.SFSEvent.LOGIN, (loginResponse) => {
              res(loginResponse);
              this.SFSLog(loginResponse)
            }, this);

            this.mSFSClient.send(new SFS2X.LoginRequest(phonenumber, "", params, "AnywhereZone"));
          });
        });
      }
    });
  }
}
