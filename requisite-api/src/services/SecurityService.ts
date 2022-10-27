import User from '@requisite/model/lib/user/User';
import AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';
import Product from '@requisite/model/lib/product/Product';

export default interface SecurityService {
    login(authRequest: AuthenticationRequest): Promise<User>;
    register(regRequest: RegistrationRequest): Promise<User>;
    getOrgMemberships(user: User): Promise<Membership<Organization>[]>;
    getProductMemberships(user: User): Promise<Membership<Product>[]>;
    isSystemAdmin(user: User): Promise<boolean>;
}
