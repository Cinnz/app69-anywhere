
/**
 * Địa điểm
 */
export class Location {
    private _lat: number;
    private _lng: number;
    private _address: string;
    private _time: number;

    setLatLng(latitude: number, longitude: number) {
        this._lat = latitude;
        this._lng = longitude;
    }

    set address(address: string){
        this._address = address;
    }

    set time(time: number){
        this._time = time;
    }

    get time(){
        return this._time;
    }

    get address(){
        return this._address;
    }


}