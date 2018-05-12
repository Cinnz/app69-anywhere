import { Location } from './location';
import { Route } from './route';

/**
 * Lịch sử di chuyển
 */
export class Trace {

    private _steps: Array<Location> = [];

    constructor(private _uid: string, private _date: string) {

    }

    get uid() {
        return this._uid;
    }

    get date() {
        return this._date;
    }

    set steps(steps: Array<any>) {
        this._steps = [];
        steps.forEach(step => {
            let location = new Location(step.address, step.lat, step.lng, step.time);
            
            this._steps.push(location);
        });
    }

    get steps(){
        return this._steps;
    }

}