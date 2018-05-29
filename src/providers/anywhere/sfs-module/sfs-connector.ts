import { SFSEvent } from '../../core/smartfox/sfs-events';
import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { SfsCmd } from './sfs-cmd';

declare var SFS2X;

@Injectable()
export class AwSFSConnector  {

  secret = "9ACC22D8B0595EE06CDC8ACB5460560D";

  mSFSClient = null;
  mDebug = true;
  isConnected = false;
  isLoggedIn = false;

  constructor() {
    this.connect();
  }

  init() {
    var anywhereConfig = {
      host: "192.168.2.177",
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

    this.mSFSClient.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponse, this);
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

  public disconnect() {
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
    console.log(phonenumber, password, isMd5);

    return new Promise((res, rej) => {

      if (!phonenumber && !password) {
        // Fake Login to sign up
        this.mSFSClient.removeEventListener(SFS2X.SFSEvent.LOGIN, () => { });

        this.mSFSClient.addEventListener(SFS2X.SFSEvent.LOGIN, (loginResponse) => {
          res();
        }, this);

        this.mSFSClient.send(new SFS2X.LoginRequest());
      }
      else {
        // Disconnect => Connect => Login
        this.disconnect().then(() => {
          this.connect().then(() => {
            let md5Password = isMd5 ? password : Md5.hashStr(password);
            let params = new SFS2X.SFSObject();

            params.putUtfString("phonenumber", phonenumber);
            params.putUtfString("password", md5Password);
            params.putUtfString("sign", Md5.hashStr(phonenumber + this.secret + md5Password));

            this.mSFSClient.removeEventListener(SFS2X.SFSEvent.LOGIN, () => { });
            this.mSFSClient.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, () => { });

            this.mSFSClient.addEventListener(SFS2X.SFSEvent.LOGIN, (loginResponse) => {
              this.SFSLog(loginResponse)
              res({ success: 1, msg: "Đăng nhập thành công" });
            }, this);

            this.mSFSClient.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, (loginResponse) => {
              console.log("LOGIN_ERROR", loginResponse);

              res({ success: 0, msg: "Tài khoản hoặc mật khẩu không đúng" })
            }, this);

            this.mSFSClient.send(new SFS2X.LoginRequest(phonenumber, "", params, "AnywhereZone"));
          });
        });
      }
    });
  }

  getOtp(phonenumber: string) {
    return new Promise((res, rej) => {
      let params = new SFS2X.SFSObject();

      params.putUtfString("phonenumber", phonenumber);
      params.putUtfString("REQUEST_ID", SfsCmd.GET_OTP);

      if (this.isConnected) {
        res(this.mSFSClient.send(new SFS2X.ExtensionRequest("lobby", params)));
      }
      else {
        this.connect().then(() => {
          res(this.mSFSClient.send(new SFS2X.ExtensionRequest("lobby", params)));
        }).catch(e => {
          rej();
        });
      }
    });
  }

  onExtensionResponse(response) {
    console.log(response);

    // request get OTP
    if (response.cmd == SfsCmd.GET_OTP) {

    }
    // request confirm OTP
    else if (response.cmd == SfsCmd.VERIFY_OTP) {

    }
  }

  signUp(phonenumber: string, password: string, otp: string) {
    return new Promise((res, rej) => {
      let params = new SFS2X.SFSObject();

      params.putUtfString("REQUEST_ID", "verify_otp");
      params.putUtfString("otp_code", otp);
      params.putUtfString("phonenumber", phonenumber);
      params.putUtfString("password", Md5.hashStr(password));
      params.putUtfString("name", phonenumber);
      params.putUtfString("avatar", "Hoai Nam avatar");
      params.putUtfString("address", "Hoai Nam address");

      if (this.isConnected) {
        this.mSFSClient.send(new SFS2X.ExtensionRequest("lobby", params));
      }
      else {

      }
    });
  }
}
