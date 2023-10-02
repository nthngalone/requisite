import type Entity from '../Entity';
import type Name from '../common/Name';

export default interface User extends Entity {
    domain: string;
    userName: string;
    name: Name;
    emailAddress: string;
    avatar: string;
    expired: boolean;
    locked: boolean;
    revoked: boolean;
}
