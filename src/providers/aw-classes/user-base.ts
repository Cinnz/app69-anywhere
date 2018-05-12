import { Location } from './location';
import { Trace } from './trace';

/**
 * Thông tin cơ bản của người dùng
 */
export class UserBase {

    private _location: Location;
    private _traces: Array<Trace> = [];
    private _status: UserStatus = UserStatus.OFFLINE;

    constructor(private _id: string, private _name: string, private _avatar: string) {

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

    get location(){
        return this._location;
    }
    
    updateLocation(location: Location) {
        this._location = location;
    }

    addTrace(trace: Trace) {
        this._traces.push(trace);
    }

}

export enum UserStatus {
    ONLINE, OFFLINE, AWAY
}