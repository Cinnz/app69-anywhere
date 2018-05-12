import { CircleBase } from './circle';
import { UserBase } from './user-base';


export class User extends UserBase {

    staticCode: string;
    dynamicCode: string;
    private _circles: Array<CircleBase> = [];

    addCircle(circle: CircleBase) {
        this._circles.push(circle);
    }

    get circles(){
        return this._circles;
    }

}