import { Location } from './location';
import { Trace } from './trace';

/**
 * Thông tin cơ bản của người dùng
 */
export class UserBase {

    location: Location;
    private _traces: Array<Trace> = [];
    private _status: UserStatus = UserStatus.OFFLINE;

    constructor(private _id: string, private _name: string, private _avatar: string, private _isPublic: boolean) {

    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get avatar() {
        return this._avatar;
    }

    get isPublic() {
        return this._isPublic;
    }

    get time(){
        return this.location.time;
    }

    get address(){
        return this.location.address;
    }
    
    updateLocation(location: Location) {
        this.location = location;
    }

    updatePublicStatus(status: boolean){
        this._isPublic = status;
    }

    addTrace(trace: Trace) {
        this._traces.push(trace);
    }

    getTraceById(traceId: string){
        for(let i = 0; i < this._traces.length; i++){
            let trace = this._traces[i];

            if(trace.id == traceId){
                return trace;
            }
        }
        return null;
    }


}

export enum UserStatus {
    ONLINE, OFFLINE, AWAY
}