import { Circle } from './../aw-classes/circle';
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs/observable';

@Injectable()
export class CircleController {

    private _mCircles: Array<Circle> = [];

    constructor() {

    }

    get circles() {
        return this._mCircles;
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

            this.requestCircleData(circleId).subscribe(data => {
                let circle = new Circle(data.id, data.name, data.adminId);

                circle.onResponseData(data.members, data.routes);
                this.addCircle(circle);

                res(circle);
            });
        });
    }

    /**
     * lấy thông tin chi tiết của Circle từ server
     * @param circleId 
     */
    private requestCircleData(circleId: string): Observable<any> {
        return new Observable((observer) => {
            setTimeout(() => {
                observer.next({
                    id: circleId,
                    name: circleId == "c0001" ? "Bạn bè" : (circleId == "c0002" ? "Gia đình" : "Đồng Nghiệp"),
                    adminId: circleId == "c0001" ? "u00001" : "u00002",
                    members: [
                        {
                            id: "u0001",
                            name: "mr A",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: true,
                            location: { time: 1525419420000, address: "1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội", lat: 21.007085, lng: 105.842882 }
                        },
                        {
                            id: "u0002",
                            name: "Nguyễn Văn B",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: false,
                            location: { time: 1525448220000, address: "122 Bạch Mai, Hai Bà Trưng, Hà Nội", lat: 21.006065, lng: 105.851191 }
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
                            isPublic: true,
                            location: { time: 1525448220000, address: "147 Phố Huế, Hai Bà Trưng, Hà Nội", lat: 21.014425, lng: 105.851760 }
                        },
                        {
                            id: "u0005",
                            name: "Dương Tùng E",
                            avatar: "./assets/imgs/logo.png",
                            isPublic: false,
                            location: { time: 1525448220000, address: "20 Ô Chợ Dừa, Đống Đa, Hà Nội", lat: 21.018991, lng: 105.828955 }
                        },
                    ],
                    routes: []
                });
            }, 1000);
        });
    }
}