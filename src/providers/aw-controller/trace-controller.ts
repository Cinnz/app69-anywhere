import { Utils } from './../app-utils';
import { Observable } from 'rxjs/observable';
import { Injectable } from '@angular/core';
import { Trace } from '../aw-classes/trace';


@Injectable()
export class TraceController {

    private _traces: Array<Trace> = [];

    findTraceOnOurs(uid: string, date: string) {
        for (let i = 0; i < this._traces.length; i++) {
            let trace = this._traces[i];

            if (trace.uid == uid) {
                if (trace.date == date) {
                    return trace;
                }
            }
        }
        return null;
    }

    /**
     * Lấy lộ trình ngày gần nhất có thông tin trên hệ thống
     */
    getLastestTrace(uid: string): Observable<any> {
        return new Observable((observer) => {
            setTimeout(() => {
                observer.next({
                    trace: {
                        uid: uid,
                        time: "2018-05-09",
                        steps: [
                            { time: 1525395600000, address: "122 Bạch Mai, Hai Bà Trưng, Hà Nội", lat: 21.006065, lng: 105.851191 },
                            { time: 1525396800000, address: "Thanh Nhàn, Hai Bà Trưng, Hà Nội, Vietnam", lat: 21.008443, lng: 105.851497 },
                            { time: 1525397700000, address: "319 Phố Huế, Hai Bà Trưng, Hà Nội, Vietnam", lat: 21.009692, lng: 105.851535 },
                            { time: 1525403520000, address: "Lê Đại Hành, Hai Bà Trưng , Hà Nội, Vietnam", lat: 21.013484, lng: 105.849166 },
                            { time: 1525431000000, address: "Khâm Thiên, Đống Đa, Hà Nội, Vietnam", lat: 21.018989, lng: 105.839746 },
                            { time: 1525445040000, address: "122 Bạch Mai, Hai Bà Trưng, Hà Nội", lat: 21.006065, lng: 105.851191 },
                        ]
                    }
                });
            }, 1000);
        });
    }

    /**
     * Lấy thông tin lộ trình theo ngày
     * @param uid UserId
     * @param date Ngày cần lấy (yyyy-mm-dd)
     */
    getTraceByDate(uid: string, date: string) {
        return new Promise((res, rej) => {

            if (date != Utils.getRequestDate(new Date)) {
                let trace = this.findTraceOnOurs(uid, date);

                if (trace) {
                    res(trace);
                }
            }

            this.requestTraceData(uid, date).subscribe(data => {
                let t = data['trace'];
                let trace = this.findTraceOnOurs(uid, date);

                if (trace) {
                    trace.steps = t.steps;
                }
                else {
                    trace = new Trace(t.uid, t.time);
                    trace.steps = t.steps;
                    this._traces.push(trace);
                }

                res(trace);
            });
        });
    }

    requestTraceData(uid: string, date: string): Observable<any> {
        return new Observable((observer) => {
            setTimeout(() => {
                observer.next({
                    trace: {
                        uid: uid,
                        time: date,
                        steps: [
                            { time: 1525395600000, address: "122 Bạch Mai, Hai Bà Trưng, Hà Nội", lat: 21.006065, lng: 105.851191 },
                            { time: 1525396800000, address: "Thanh Nhàn, Hai Bà Trưng, Hà Nội, Vietnam", lat: 21.008443, lng: 105.851497 },
                            { time: 1525397700000, address: "319 Phố Huế, Hai Bà Trưng, Hà Nội, Vietnam", lat: 21.009692, lng: 105.851535 },
                            { time: 1525403520000, address: "Lê Đại Hành, Hai Bà Trưng , Hà Nội, Vietnam", lat: 21.013484, lng: 105.849166 },
                            { time: 1525431000000, address: "Khâm Thiên, Đống Đa, Hà Nội, Vietnam", lat: 21.018989, lng: 105.839746 },
                            { time: 1525445040000, address: "122 Bạch Mai, Hai Bà Trưng, Hà Nội", lat: 21.006065, lng: 105.851191 },
                        ]
                    }
                });
            }, 1000);
        });
    }
}