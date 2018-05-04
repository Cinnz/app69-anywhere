import { Route } from './route';

/**
 * Lịch sử di chuyển
 */
export class Trace{

    route: Route;
    
    constructor(private _id: string, private _time: number){

    }

    get id(){
        return this._id;
    }

}