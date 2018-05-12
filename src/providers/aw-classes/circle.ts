import { Location } from './location';
import { Member } from './member';
import { Route } from './route';
import { UserBase } from './user-base';

export class CircleBase {

    constructor(private _id: string, private _name: string, private _adminId) {

    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get adminId() {
        return this._adminId;
    }

    updateAdmin(adminId: string) {
        this._adminId = adminId;
    }
}

/**
 * Vòng tròn kết nối
 */
export class Circle extends CircleBase {

    private _members: Array<Member> = [];
    private _routes: Array<Route> = [];

    get members() {
        return this._members;
    }

    get routes() {
        return this._routes;
    }

    onResponseData(members, routes) {
        members.forEach(m => {
            let member = new Member(m.id, m.name, m.avatar, m.isPublic);

            if (m.location) {
                let location = new Location(m.location.address, m.location.lat, m.location.lng, m.location.time);
                member.updateLocation(location);
            }
            this.addMember(member);
        });

        routes.forEach(route => {
            this.addRoute(route);
        })
    }


    /**
     * Add a member to Circle
     * @param user User
     */
    addMember(user: Member) {
        this._members.push(user);
    }

    addRoute(route: Route) {
        this._routes.push(route);
    }

    removeMember(user: Member) {
        let index = this._members.indexOf(user);

        this._members.splice(index, 1);
    }

}