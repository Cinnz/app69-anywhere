import { LatLng } from "@ionic-native/google-maps";

/**
 * Địa điểm
 */
export class Location {

    private _title: string = "title";

    constructor(private _address: string, private _lat: number, private _lng: number, private _time: number) {

    }

    setLatLng(latitude: number, longitude: number) {
        this._lat = latitude;
        this._lng = longitude;
    }

    set address(address: string) {
        this._address = address;
    }

    get address() {
        return this._address;
    }

    set time(time: number) {
        this._time = time;
    }

    get time() {
        return this._time;
    }

    set title(title: string) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    get latLng() {
        return new LatLng(this._lat, this._lng);
    }
}

export class NotUploadYetLocation extends Location {
    userId: string;

    setUserId(userId: string) {
        this.userId = userId;
    }
}