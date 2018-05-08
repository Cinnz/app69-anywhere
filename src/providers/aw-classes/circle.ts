import { Route } from './route';
import { UserBase } from './user-base';

/**
 * Vòng tròn kết nối
 */
export class Circle {

    private _members: Array<UserBase> = [];
    private _routes: Array<Route> = [];

    constructor(private _id: string, private _name: string, private _adminId: string) {

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

    get members() {
        return this._members;
    }

    get routes() {
        return this._routes;
    }

    onResponseData(members: Array<UserBase>, routes: Array<Route>) {
        members.forEach(member => {
            this.addMember(member);
        });

        routes.forEach(route => {
            this.addRoute(route);
        })
    }

    updateAdmin(adminId: string) {
        this._adminId = adminId;
    }

    /**
     * Add a member to Circle
     * @param user User
     */
    addMember(user: UserBase) {
        this._members.push(user);
    }

    addRoute(route: Route) {
        this._routes.push(route);
    }

    removeMember(user: UserBase) {
        let index = this._members.indexOf(user);

        this._members.splice(index, 1);
    }

}