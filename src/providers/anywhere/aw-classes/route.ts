import { Location } from './location';

/**
 * Lộ trình
 */
export class Route {

    locationList: Array<PrivateLocation>;

    constructor(private _id: string, private _time: number) {

    }

}

class PrivateLocation {

    index: number;
    time: number;
    location: Location;

}