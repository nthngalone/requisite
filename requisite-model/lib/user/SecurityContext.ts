import Membership from './Membership';
import Organization from '../org/Organization';
import Product from '../product/Product';
import User from './User';

export default interface SecurityContext {
    user: User;
    orgMemberships: Membership<Organization>[];
    productMemberships: Membership<Product>[];
    systemAdmin: boolean;
}
