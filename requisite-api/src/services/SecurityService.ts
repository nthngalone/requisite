import type User from '@requisite/model/lib/user/User';
import type AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import type RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';
import type Organization from '@requisite/model/lib/org/Organization';
import type Membership from '@requisite/model/lib/user/Membership';
import type Product from '@requisite/model/lib/product/Product';

export default interface SecurityService {
    login(authRequest: AuthenticationRequest): Promise<User>;
    register(regRequest: RegistrationRequest): Promise<User>;
    getOrgMemberships(user: User): Promise<Membership<Organization>[]>;
    getProductMemberships(user: User): Promise<Membership<Product>[]>;
    isSystemAdmin(user: User): Promise<boolean>;
}
