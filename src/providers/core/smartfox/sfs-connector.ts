
import { SFSEvent } from './sfs-events';
// import { Config } from '../app/config';
import { SFSState } from './sfs-state';

var SFS2X = window['SFS2X'];

export class SFSConnector  {
    public mSFSClient: any;
    protected mHost: string = "";
    protected mPort: number = 9933;
    protected mZone: string = "";
    protected mDebug: boolean = true;
    protected mSFSState: number = SFSState.NONE;
    private isConnected = false;
    protected isLoggedIn = false;

    constructor() {
        // super();
    }
    public setSFSState(state: number) {
        this.mSFSState = state;
    }
    public setSFSHost(sfshost: string): void {
        this.mHost = sfshost;
    }
    public getSFSHost(): string {
        return this.mHost;
    }
    public setSFSPort(sfsport: number): void {
        this.mPort = sfsport;
    }
    public getSFSPort(): number {
        return this.mPort;
    }
    public setSFSZone(sfszone: string): void {
        this.mZone = sfszone;
    }
    public getSFSZone(): string {
        return this.mZone;
    }
    public setSFSDebug(debug: boolean): void {
        this.mDebug = debug;
    }
    public isSFSDebugEnable(): boolean {
        return this.mDebug;
    }

    private initialize() {
        if (!this.mSFSClient) {
            if (SFS2X == null || SFS2X == undefined) {
                SFS2X = window['SFS2X'];
            }
            if (SFS2X) {
                this.mSFSClient = new SFS2X.SmartFox(true);
            }
        }
    }

    public SFSLog(message) {
        if (!this.mDebug) return;
        console.log("SFS : " + message);
    }

    public connect(): Promise<any> {
        //Create mSFSClient if not exists
        this.initialize();
        return new Promise((resolve, reject) => {
            if (this.mSFSClient) {
                if (!this.isConnected) {
                    //Connect to smartfox server
                    this.mSFSClient.connect(this.getSFSHost(), this.getSFSPort());
                    this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
                    this.mSFSClient.removeEventListener(SFSEvent.CONNECTION, () => { });
                    //If connect lost
                    this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
                        this.SFSLog("on connection " + JSON.stringify(eventParams));
                        this.onConnectionLost(eventParams.reason);
                        return reject("Ngắt kết nối smartfox" + eventParams.reason);
                    });
                    //If connect success
                    this.mSFSClient.addEventListener(SFSEvent.CONNECTION, (eventParams) => {
                        this.SFSLog("on connection " + JSON.stringify(eventParams));
                        if (eventParams.success) {
                            this.onConnection();
                            return resolve("connect success");
                        } else {
                            return reject("Không thể kết nối tới server");
                        }
                    });
                } else {
                    return resolve("Kết nối đã tồn tại");
                }
            } else {
                return reject("Không tìm thấy smartfox");
            }
        });

    }

    onExtensionResponse(params) {

    }

    // public _Connect() {
    //     return new Promise(
    //         (resolve, reject) => {
    //             this.initialize().then(
    //                 () => {
    //                     console.log("connect ", this.getSFSHost(), this.getSFSPort());
    //                     this.mSFSClient.connect(this.getSFSHost(), this.getSFSPort());
    //                     this.mSFSClient.removeEventListener(SFSEvent.CONNECTION, () => { });
    //                     this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
    //                         console.log(eventParams);
    //                         this.onConnectionLost(eventParams.reason);
    //                     });
    //                     this.mSFSClient.addEventListener(SFSEvent.CONNECTION, (eventParams) => {
    //                         this.SFSLog("on connection " + JSON.stringify(eventParams));
    //                         if (eventParams.success) {
    //                             this.onConnection();
    //                             resolve();
    //                         }
    //                         else reject();
    //                     });

    //                 }, error => {
    //                     reject(error);
    //                 }
    //             ).catch(
    //                 () => { reject(); }
    //             );
    //         }
    //     );
    // }

    public _Disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.isConnected || !this.mSFSClient) {
                return resolve();
            } else {
                this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
                this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (reason) => {
                    return resolve();
                });
                this.mSFSClient.disconnect();
            }
        });
    }

    /**Khi thiết lập được kết nối, làm một số việc linh tinh ...*/
    private onConnection() {
        console.log(this.mSFSClient);
        this.SFSLog("on Connection success");
        this.isConnected = true;
    }

    /**
     * Smartfox events
     */

    protected onConnectionLost(reason: string) {
        this.SFSLog("on Connection Lost with reason " + reason);
        this.isConnected = false;
        this.isLoggedIn = false;
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
        this.mSFSClient = null;
    }

    public checkConnect() {
        return this.isConnected;
    }

    public send(cmd: string, params: any) {
        this.mSFSClient.send(new SFS2X.ExtensionRequest(cmd, params));
    }
    public checkLoggedIn() {
        return this.isLoggedIn;
    }

}