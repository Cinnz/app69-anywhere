import { CircleBase } from './circle';
import { UserBase } from './user-base';
import { Location } from './location';


export class User extends UserBase {

    private _home: Location;
    staticCode: string;
    private _dynamicCode: string;
    private _circles: Array<CircleBase> = [];

    addCircle(circle: CircleBase) {
        this._circles.push(circle);
    }

    get circles(){
        return this._circles;
    }

    set home(location: Location){
        this._home = location;
    }

    get home(){
        return this._home;
    }

    resetDynamicCode(){
        this.dynamicCode = "------";
    }

    set dynamicCode(code: string){
        this._dynamicCode = code;
    }

    get dynamicCode(){
        return this._dynamicCode;
    }

}