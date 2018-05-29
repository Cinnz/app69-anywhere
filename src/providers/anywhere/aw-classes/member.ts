import { UserBase } from './user-base';
import { Marker } from '@ionic-native/google-maps';


export class Member extends UserBase {

    private _marker: Marker;

    constructor(id: string, name: string, avatar: string, private _isPublic: boolean) {
        super(id, name, avatar);
    }

    get isPublic() {
        return this._isPublic;
    }

    set isPublic(isPublic: boolean) {
        this._isPublic = isPublic;
    }

    set marker(marker: Marker) {
        this._marker = marker;
    }

    get marker() {
        if (this._marker) {
            return this._marker;
        }
        else{
            return null;
        }
    }
}