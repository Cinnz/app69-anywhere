import { Location } from './aw-classes/location';
import { LatLng, GoogleMap, CameraPosition, ILatLng } from '@ionic-native/google-maps';


export class Utils {

    public static getRequestDate(date: Date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    public static latLngsFromSteps(steps: Array<Location>) {
        let latLngs: Array<LatLng> = [];

        steps.forEach(step => {
            latLngs.push(step.latLng);
        });

        return latLngs;
    }

    public static animateCameraTo(map: GoogleMap, latLng: LatLng, duration: number) {
        if (map) {
            let cameraPosition: CameraPosition<ILatLng> = {
                target: latLng,
                duration: duration
            }
            map.animateCamera(cameraPosition);
        }
    }
}