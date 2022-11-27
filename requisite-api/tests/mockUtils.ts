import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';
import Membership from '@requisite/model/lib/user/Membership';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';
import OrganizationsDataModel from '../src/services/sqlz/data-models/OrganizationsDataModel';
import OrgMembershipsDataModel from '../src/services/sqlz/data-models/OrgMembershipsDataModel';
import ProductsDataModel from '../src/services/sqlz/data-models/ProductsDataModel';
import SystemAdminsDataModel from '../src/services/sqlz/data-models/SystemAdminsDataModel';
import UsersDataModel from '../src/services/sqlz/data-models/UsersDataModel';
import { getSequelize } from '../src/services/sqlz/SqlzUtils';

function getRandomItem<T>(collection: T[]): T {
    return collection.length > 0
        ? collection[Math.floor(Math.random() * collection.length)]
        : null as T;
}

export async function getMockedUsers(
    userOpts?: Record<string, unknown>
): Promise<User[]> {
    UsersDataModel.initialize(await getSequelize());
    const opts: Record<string, unknown> = {};
    if (userOpts) {
        const whereOpts: Record<string, unknown> = {};
        if (userOpts.revoked !== undefined) {
            whereOpts.revoked = userOpts.revoked;
        }
        if (userOpts.locked !== undefined) {
            whereOpts.locked = userOpts.locked;
        }
        if (userOpts.expired !== undefined) {
            whereOpts.expired = userOpts.expired;
        }
        opts.where = whereOpts;
    }
    return (await UsersDataModel.findAll(opts)).map(o => UsersDataModel.toUser(o));
}

export async function getMockedUser(
    userOpts?: Record<string, unknown>
): Promise<User> {
    const users = await getMockedUsers(userOpts);
    return getRandomItem(users);
}


export async function getMockedSystemAdminMemberships(): Promise<SystemAdmin[]> {
    SystemAdminsDataModel.initialize(await getSequelize());
    return (await SystemAdminsDataModel.findAll()).map(
        o => SystemAdminsDataModel.toSystemAdmin(o)
    );
}

export async function getMockedSystemAdminMembership(): Promise<SystemAdmin> {
    const admins = await getMockedSystemAdminMemberships();
    return getRandomItem(admins);
}

export async function getMockedUserForSystemAdmin(): Promise<User> {
    return (await getMockedSystemAdminMembership()).user;
}

export async function getMockedOrgs(): Promise<Organization[]> {
    OrganizationsDataModel.initialize(await getSequelize());
    return (await OrganizationsDataModel.findAll()).map(
        o => OrganizationsDataModel.toOrganization(o)
    );
}

export async function getMockedOrg(): Promise<Organization> {
    const orgs = await getMockedOrgs();
    return getRandomItem(orgs);
}

export async function getMockedOrgMemberships(
    membershipOpts?: Record<string, unknown>
): Promise<Membership<Organization>[]> {
    OrgMembershipsDataModel.initialize(await getSequelize());
    const opts: Record<string, unknown> = {};
    if (membershipOpts) {
        const whereOpts: Record<string, unknown> = {};
        if (membershipOpts.entity) {
            const org = membershipOpts.entity as Organization;
            whereOpts.orgId = org.id;
        }
        if (membershipOpts.role) {
            whereOpts.role = membershipOpts.role;
        }
        if (membershipOpts.user) {
            const user = membershipOpts.user as User;
            whereOpts.userId = user.id;
        }
        opts.where = whereOpts;
    }
    return (await OrgMembershipsDataModel.findAll(opts)).map(
        m => OrgMembershipsDataModel.toOrgMembership(m)
    );
}

export async function getMockedOrgMembership(
    membershipOpts?: Record<string, unknown>
): Promise<Membership<Organization>> {
    const memberships = await getMockedOrgMemberships(membershipOpts);
    return getRandomItem(memberships);
}

export async function getMockedUserForOrgMembership(
    membershipOpts?: Record<string, unknown>,
    matching = true
): Promise<User> {
    const orgMemberships = await getMockedOrgMemberships(membershipOpts);
    let membership;
    if (!matching) {
        const allMemberships = await getMockedOrgMemberships();
        membership = getRandomItem(allMemberships.filter(
            member => orgMemberships.every(matched => matched.user.id !== member.user.id)
        ));
    } else {
        membership = getRandomItem(orgMemberships);
    }
    return membership.user;
}

export async function getMockedProducts(
    prodOpts?: Record<string, unknown>
): Promise<Product[]> {
    ProductsDataModel.initialize(await getSequelize());
    const opts: Record<string, unknown> = {};
    if (prodOpts) {
        const whereOpts: Record<string, unknown> = {};
        if (prodOpts.organization) {
            whereOpts.orgId = prodOpts.organization;
        }
        if (prodOpts.public !== undefined) {
            whereOpts.public = prodOpts.public;
        }
        opts.where = whereOpts;
    }
    return (await ProductsDataModel.findAll(opts)).map(
        p => ProductsDataModel.toProduct(p)
    );
}

export async function getMockedProduct(
    prodOpts?: Record<string, unknown>
): Promise<Product> {
    const products = await getMockedProducts(prodOpts);
    return getRandomItem(products);
}
