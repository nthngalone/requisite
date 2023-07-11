import Organization from '@requisite/model/lib/org/Organization';
import Persona from '@requisite/model/lib/product/Persona';
import Product from '@requisite/model/lib/product/Product';
import Membership, { OrganizationRole, ProductRole, SystemRole } from '@requisite/model/lib/user/Membership';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';

export const mockOrgs: Organization[] = [{
    id: 0,
    name: 'Organization 0'
} as Organization, {
    id: 1,
    name: 'Organization 1'
} as Organization];

export const mockProducts: Product[] = [{
    id: 0,
    organizationId: mockOrgs[0].id,
    organization: mockOrgs[0],
    name: 'Org-0-Product-0-Private',
    description: 'Org-0-Product-0-Private',
    public: false,
    personas: [{
        name: 'User',
        description: 'Basic user',
        avatar: 'fa-solid fa-user'
    }, {
        name: 'Manager',
        description: 'Manager',
        avatar: 'fa-solid fa-user-tie'
    }, {
        name: 'Support',
        description: 'Manager',
        avatar: 'fa-solid fa-user-headset'
    }]
} as unknown as Product, {
    id: 1,
    organizationId: mockOrgs[0].id,
    organization: mockOrgs[0],
    name: 'Org-0-Product-1-Public',
    description: 'Org-0-Product-1-Public',
    public: true,
    personas: [{
        name: 'Musician',
        description: 'A user primarily responsible for composing music',
        avatar: 'fa-solid fa-user-music'
    }, {
        name: 'Writer',
        description: 'A user primarily responsible for writing',
        avatar: 'fa-solid fa-user-pen'
    }, {
        name: 'Actor',
        description: 'A user primarily responsible for acting',
        avatar: 'fa-solid fa-user-shakespear'
    }]
} as unknown as Product, {
    id: 2,
    organizationId: mockOrgs[1].id,
    organization: mockOrgs[1],
    name: 'Org-1-Product-2-Private',
    description: 'Org-1-Product-2-Private',
    public: false,
    personas: [{
        name: 'Patient',
        description: 'A user seeking healthcare',
        avatar: 'fa-solid fa-user-injured'
    }, {
        name: 'Nurse',
        description: 'A user performing in the nursing role for providing healthcare',
        avatar: 'fa-solid fa-user-nurse'
    }, {
        name: 'Doctor',
        description: 'A user performing in a doctor or physician role for providing healthcare',
        avatar: 'fa-solid fa-user-doctor'
    }]
} as unknown as Product, {
    id: 3,
    organizationId: mockOrgs[1].id,
    organization: mockOrgs[1],
    name: 'Org-1-Product-3-Private',
    description: 'Org-1-Product-3-Private',
    public: false,
    personas: [{
        name: 'Secret Agent',
        description: 'A government secret agent or spy',
        avatar: 'fa-solid fa-user-secret'
    }, {
        name: 'Pencil Pusher',
        description: 'A government desk jockey',
        avatar: 'fa-solid fa-user-tie'
    }, {
        name: 'Politician',
        description: 'An elected government official',
        avatar: 'fa-solid fa-handshake'
    }]
} as unknown as Product];

export const mockPersonas = [] as Persona[];
mockProducts.forEach((product) => {
    if (product.personas) {
        product.personas.forEach((persona) => {
            persona.id = mockPersonas.length;
            mockPersonas.push({
                ...persona,
                productId: product.id,
                product: product
            } as unknown as Persona);
        });
    }
});

const mockUsersRef: Record<string, User> = {

    sysadmin: {
        id: 0,
        domain: 'local',
        userName: 'sysadmin',
        emailAddress: 'sysadmin@requisite.dev',
        password: 'pass',
        orgMemberships: [],
        productMemberships: []
    } as unknown as User,

    revoked: {
        id: 1,
        domain: 'local',
        userName: 'revoked',
        emailAddress: 'revoked@requisite.dev',
        revoked: true,
        password: 'pass',
        orgMemberships: [],
        productMemberships: []
    } as unknown as User,

    org0Owner: {
        id: 2,
        domain: 'local',
        userName: 'org0Owner',
        emailAddress: 'org0Owner@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.OWNER
        } as unknown as Membership<Organization>],
        productMemberships: []
    } as unknown as User,

    org0MemberProduct0Owner: {
        id: 3,
        domain: 'local',
        userName: 'org0MemberProduct0Owner',
        emailAddress: 'org0MemberProduct0Owner@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[0],
            role: ProductRole.OWNER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org1MemberProduct2Owner: {
        id: 4,
        domain: 'local',
        userName: 'org1MemberProduct2Owner',
        emailAddress: 'org1MemberProduct2Owner@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[2],
            role: ProductRole.OWNER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org1MemberProduct2Stakeholder: {
        id: 5,
        domain: 'local',
        userName: 'org1MemberProduct2Stakeholder',
        emailAddress: 'org1MemberProduct2Stakeholder@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[2],
            role: ProductRole.STAKEHOLDER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org0and1Member: {
        id: 6,
        domain: 'local',
        userName: 'org0and1Member',
        emailAddress: 'org0and1Member@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>, {
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: []
    } as unknown as User,

    org0MemberProduct0Stakeholder: {
        id: 7,
        domain: 'local',
        userName: 'org0MemberProduct0Stakeholder',
        emailAddress: 'org0MemberProduct0Stakeholder@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[0],
            role: ProductRole.STAKEHOLDER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org0MemberProduct0Contributor: {
        id: 8,
        domain: 'local',
        userName: 'org0MemberProduct0Contributor',
        emailAddress: 'org0MemberProduct0Contributor@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[0],
            role: ProductRole.CONTRIBUTOR
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org1MemberProduct2Contributor: {
        id: 9,
        domain: 'local',
        userName: 'org1MemberProduct2Contributor',
        emailAddress: 'org1MemberProduct2Contributor@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[2],
            role: ProductRole.CONTRIBUTOR
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org1MemberProduct2and3Contributor: {
        id: 10,
        domain: 'local',
        userName: 'org1MemberProduct2and3Contributor',
        emailAddress: 'org1MemberProduct2and3Contributor@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[2],
            role: ProductRole.CONTRIBUTOR
        } as unknown as Membership<Organization>, {
            entity: mockProducts[3],
            role: ProductRole.CONTRIBUTOR
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org1Owner: {
        id: 11,
        domain: 'local',
        userName: 'org1Owner',
        emailAddress: 'org1Owner@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.OWNER
        } as unknown as Membership<Organization>],
        productMemberships: []
    } as unknown as User,

    org0MemberProduct1Owner: {
        id: 12,
        domain: 'local',
        userName: 'org0MemberProduct1Owner',
        emailAddress: 'org0MemberProduct1Owner@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[1],
            role: ProductRole.OWNER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org0MemberProduct1Stakeholder: {
        id: 13,
        domain: 'local',
        userName: 'org0MemberProduct1Stakeholder',
        emailAddress: 'org0MemberProduct1Stakeholder@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[1],
            role: ProductRole.STAKEHOLDER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org0MemberProduct1Contributor: {
        id: 14,
        domain: 'local',
        userName: 'org0MemberProduct1Contributor',
        emailAddress: 'org0MemberProduct1Contributor@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[1],
            role: ProductRole.CONTRIBUTOR
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org1MemberProduct3Owner: {
        id: 15,
        domain: 'local',
        userName: 'org1MemberProduct3Owner',
        emailAddress: 'org1MemberProduct3Owner@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: [{
            entity: mockProducts[3],
            role: ProductRole.OWNER
        } as unknown as Membership<Organization>]
    } as unknown as User,

    org0Member: {
        id: 16,
        domain: 'local',
        userName: 'org0Member',
        emailAddress: 'org0Member@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[0],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: []
    } as unknown as User,

    org1Member: {
        id: 17,
        domain: 'local',
        userName: 'org1Member',
        emailAddress: 'org1Member@requisite.dev',
        password: 'pass',
        orgMemberships: [{
            entity: mockOrgs[1],
            role: OrganizationRole.MEMBER
        } as unknown as Membership<Organization>],
        productMemberships: []
    } as unknown as User,
};

export const mockSysAdmins: SystemAdmin[] = [{
    id: 0,
    userId: mockUsersRef.sysadmin.id,
    user: mockUsersRef.sysadmin, // sysadmin
    entity: {},
    role: SystemRole.ADMIN
} as unknown as SystemAdmin];

export const mockOrgMemberships: Membership<Organization>[] = [];
export const mockProductMemberships: Membership<Product>[] = [];
export const mockUsers: User[] = Object.values(mockUsersRef);

mockUsers.forEach((user) => {

    // Map org memberships from the users
    const orgMemberships =
        (user as unknown as Record<string, Membership<Organization>[]>)
            .orgMemberships;
    orgMemberships.forEach((membership) => {
        mockOrgMemberships.push({
            ...membership,
            id: mockOrgMemberships.length,
            userId: user.id,
            orgId: membership.entity.id,
            user
        } as unknown as Membership<Organization>);
    });

    // Map product memberships from the users
    const productMemberships =
        (user as unknown as Record<string, Membership<Product>[]>)
            .productMemberships;
    productMemberships.forEach((membership) => {
        mockProductMemberships.push({
            ...membership,
            id: mockProductMemberships.length,
            userId: user.id,
            productId: membership.entity.id,
            user
        } as unknown as Membership<Product>);
    });
});


