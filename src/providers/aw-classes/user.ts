import { Circle } from './circle';
import { UserBase } from './user-base';


export class User extends UserBase {

    staticCode: string;
    dynamicCode: string;
    circles: Array<Circle>;
    
}