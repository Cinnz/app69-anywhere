import { Circle } from './../aw-classes/circle';
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs/observable';

@Injectable()
export class CircleController {

    private _mCircles: Array<Circle> = [];

    constructor() {

    }

    addCircle(circle: Circle) {
        this._mCircles.push(circle);
    }

    getCircle(circleId: string) {
        return new Promise((res, rej) => {
            for (let i = 0; i < this._mCircles.length; i++) {
                let circle = this._mCircles[i];

                if (circle.id == circleId) {
                    res(circle);
                }
            }

            this.getCircleData(circleId).subscribe(data => {
                let circle = new Circle(data.id, data.name, data.adminId);
                
                circle.onResponseData(data.members, data.routes);
                this.addCircle(circle);
            });
            res();
        });
    }

    /**
     * lấy thông tin chi tiết của Circle từ server
     * @param circleId 
     */
    private getCircleData(circleId: string): Observable<any> {
        return new Observable((observer) => {
            setTimeout(() => {
                observer.next({
                    id: circleId,
                    name: "Bạn bè",
                    adminId: "123456",
                    members: [
                        {
                            id: "u0001",
                            name: "mr A",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: true
                        },
                        {
                            id: "u0002",
                            name: "Nguyễn Văn B",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: false
                        },
                        {
                            id: "u0003",
                            name: "Trần Minh C",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: true
                        },
                        {
                            id: "u0004",
                            name: "Lê Văn D",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: true
                        },
                        {
                            id: "u0005",
                            name: "Dương Tùng E",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: false
                        },
                    ],
                    routes: []
                });
            }, 1000);
        });
    }

}