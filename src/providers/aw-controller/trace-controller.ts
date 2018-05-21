import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseModule } from './../firebase-module/firebase-module';
import { Utils } from './../app-utils';
import { Observable } from 'rxjs/observable';
import { Injectable } from '@angular/core';
import { Trace } from '../aw-classes/trace';


@Injectable()
export class TraceController {

    private _traces: Array<Trace> = [];
    private _mFirebaseModule: FirebaseModule;

    constructor(private mAngularFirestore: AngularFirestore) {
        this._mFirebaseModule = new FirebaseModule(mAngularFirestore);
    }

    findTraceOnOurs(uid: string, date: string) {
        return new Promise((res, rej) => {
            for (let i = 0; i < this._traces.length; i++) {
                let trace = this._traces[i];

                if (trace.uid == uid) {
                    if (trace.date == date) {
                        res(trace);
                    }
                }
            }
            return res(null);
        })
    }

    /**
     * Lấy thông tin lộ trình theo ngày
     * @param uid UserId
     * @param date Ngày cần lấy (yyyy-mm-dd)
     */
    getTraceByDate(userId: string, date: string) {
        return new Observable(observer => {
            // Không phải request ngày hiện tại => Tìm trong tempdb => nếu ko có thì request và add vào
            if (date != Utils.getRequestDate(new Date())) {
                this.findTraceOnOurs(userId, date).then((trace) => {
                    if (trace != null) {
                        observer.next(trace);
                    }
                    else {
                        this.requestTraceData(userId, date).subscribe(traceData => {
                            let trace = new Trace(userId, date);

                            trace.steps = traceData['data'];
                            this._traces.push(trace);
                            observer.next(trace);
                        });
                    }
                });
            }
            // request ngày hiện tại => request => tìm trong tempdb => có thì update, ko có thì add mới
            else {
                this.requestTraceData(userId, date).subscribe(traceData => {
                    this.findTraceOnOurs(userId, date).then((trace: Trace) => {
                        if (trace != null) {
                            trace.steps = traceData['data'];
                            observer.next(trace);
                        }
                        else {
                            let trace = new Trace(userId, date);

                            trace.steps = traceData['data'];
                            this._traces.push(trace);
                            observer.next(trace);
                        }
                    });
                });
            }
        });
    }

    requestTraceData(userId: string, date: string) {
        return this._mFirebaseModule.getTracesByUserId(userId, date);
    }
}