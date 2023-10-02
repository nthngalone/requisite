import type Membership from './Membership';
import type Organization from '../org/Organization';
import type Product from '../product/Product';
import type User from './User';

export default interface SecurityContext {
    user: User;
    orgMemberships: Membership<Organization>[];
    productMemberships: Membership<Product>[];
    systemAdmin: boolean;
}
