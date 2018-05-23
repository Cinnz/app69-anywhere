import { Observable } from 'rxjs/observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Location } from '../aw-classes/location';

@Injectable()
export class FirebaseModule {

  constructor(private mAngularFirestore: AngularFirestore) {
  }

  getTracesByUserId(userId: string, date: string) {
    return new Observable(observer => {
      this.mAngularFirestore.collection('/users').doc(userId).collection("" + date).valueChanges().subscribe(data => {
        observer.next({
          data: data
        });
      });
    });
  }

  pushLocation(userId: string, day: string, location: Location) {
    return new Promise((res, rej) => {
      this.mAngularFirestore.collection('/users').doc(userId).collection("" + day).doc("" + location.time).set({
        address: location.address,
        lat: location.latLng.lat,
        lng: location.latLng.lng,
        title: "",
        time: location.time
      }).then(() => {
        res();
      });
    });
  }

}
