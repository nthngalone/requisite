import Organization from '@requisite/model/lib/org/Organization';
import Feature from '@requisite/model/lib/product/Feature';
import Persona from '@requisite/model/lib/product/Persona';
import Product from '@requisite/model/lib/product/Product';
import Membership, { SystemRole } from '@requisite/model/lib/user/Membership';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';

export const mockOrgs: Organization[] = [{
    id: 0,
    name: 'Organization 0'
} as Organization];

export const mockProducts: Product[] = [];
export const mockPersonas = [] as Persona[];
export const mockFeatures = [] as Feature[];

const user = {
    id: 0,
    domain: 'local',
    userName: 'sysadmin',
    emailAddress: 'sysadmin@requisite.dev',
    password: 'pass',
    orgMemberships: [],
    productMemberships: []
} as unknown as User;

export const mockUsers: User[] = [user];

export const mockSysAdmins: SystemAdmin[] = [{
    id: 0,
    userId: user.id,
    user,
    entity: {},
    role: SystemRole.ADMIN
} as unknown as SystemAdmin];

export const mockOrgMemberships: Membership<Organization>[] = [];
export const mockProductMemberships: Membership<Product>[] = [];
