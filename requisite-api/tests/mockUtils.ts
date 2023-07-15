import Organization from '@requisite/model/lib/org/Organization';
import Feature from '@requisite/model/lib/product/Feature';
import Persona from '@requisite/model/lib/product/Persona';
import Product from '@requisite/model/lib/product/Product';
import Membership, { OrganizationRole, ProductRole, SystemRole } from '@requisite/model/lib/user/Membership';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';
import FeaturesDataModel from '../src/services/sqlz/data-models/FeaturesDataModel';
import OrganizationsDataModel from '../src/services/sqlz/data-models/OrganizationsDataModel';
import OrgMembershipsDataModel from '../src/services/sqlz/data-models/OrgMembershipsDataModel';
import PersonasDataModel from '../src/services/sqlz/data-models/PersonasDataModel';
import ProductMembershipsDataModel from '../src/services/sqlz/data-models/ProductMembershipsDataModel';
import ProductsDataModel from '../src/services/sqlz/data-models/ProductsDataModel';
import SystemAdminsDataModel from '../src/services/sqlz/data-models/SystemAdminsDataModel';
import UsersDataModel from '../src/services/sqlz/data-models/UsersDataModel';
import { getSequelize } from '../src/services/sqlz/SqlzUtils';

function getRandomVariant() {
    return `${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
}

export function getAuthBearer(user: User) {
    return `Bearer valid|${user.domain}|${user.userName}`;
}

export async function getMockedUsers(): Promise<User[]> {
    UsersDataModel.initialize(await getSequelize());
    return (await UsersDataModel.findAll()).map(o => UsersDataModel.toUser(o));
}

export async function getMockedUser(
    userOpts?: Record<string, unknown>
): Promise<User> {
    UsersDataModel.initialize(await getSequelize());
    const variant = getRandomVariant();
    const userName = `user${variant}`;
    try {
        const newUserModel = await UsersDataModel.create({
            domain: 'local',
            userName,
            name: {
                firstName: 'User',
                lastName: variant
            },
            avatar: `avatar${variant}`,
            emailAddress: `${userName}@requisite.dev`,
            password: 'pass',
            ...userOpts
        });
        return UsersDataModel.toUser(newUserModel);
    } catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedUser(userOpts);
        }
        throw error;
    }
}

export async function getMockedAuthBearerForUser(
    userOpts?: Record<string, unknown>
): Promise<string> {
    if (userOpts && userOpts.unknown === true) {
        return 'Bearer valid|unknown|unknown';
    } else {
        const user = await getMockedUser(userOpts);
        return getAuthBearer(user);
    }
}

export async function getMockedSystemAdminMemberships(): Promise<SystemAdmin[]> {
    SystemAdminsDataModel.initialize(await getSequelize());
    return (await SystemAdminsDataModel.findAll()).map(
        o => SystemAdminsDataModel.toSystemAdmin(o)
    );
}

export async function getMockedSystemAdminMembership(): Promise<SystemAdmin> {
    SystemAdminsDataModel.initialize(await getSequelize());
    const user = await getMockedUser();
    try {
        const newSysAdminMembership = await SystemAdminsDataModel.create({
            userId: user.id,
            user,
            entity: {},
            role: SystemRole.ADMIN
        });
        return SystemAdminsDataModel.toSystemAdmin(newSysAdminMembership);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedSystemAdminMembership();
        }
        throw error;
    }
}

export async function getMockedUserForSystemAdmin(): Promise<User> {
    return (await getMockedSystemAdminMembership()).user;
}

export async function getMockedAuthBearerSystemAdmin(): Promise<string> {
    const user = await getMockedUserForSystemAdmin();
    return getAuthBearer(user);
}

export async function getMockedOrgs(): Promise<Organization[]> {
    OrganizationsDataModel.initialize(await getSequelize());
    return (await OrganizationsDataModel.findAll()).map(
        o => OrganizationsDataModel.toOrganization(o)
    );
}

export async function getMockedOrg(): Promise<Organization> {
    OrganizationsDataModel.initialize(await getSequelize());
    try {
        const newOrg = await OrganizationsDataModel.create({
            name: 'Organization - ' + getRandomVariant()
        });
        return OrganizationsDataModel.toOrganization(newOrg);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedOrg();
        }
        throw error;
    }
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
    OrgMembershipsDataModel.initialize(await getSequelize());
    const user = membershipOpts?.user as User || await getMockedUser();
    const entity = membershipOpts?.entity as Organization || await getMockedOrg();
    const role = membershipOpts?.role || OrganizationRole.MEMBER;
    try {
        const newMembership = await OrgMembershipsDataModel.create({
            userId: user.id,
            user,
            orgId: entity.id,
            entity,
            role
        });
        return OrgMembershipsDataModel.toOrgMembership(newMembership);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedOrgMembership(membershipOpts);
        }
        throw error;
    }
}

export async function getMockedUserForOrgMembership(
    membershipOpts?: Record<string, unknown>
): Promise<User> {
    return (await getMockedOrgMembership(membershipOpts)).user;
}

export async function getMockedAuthBearerForOrgMembership(
    membershipOpts?: Record<string, unknown>
): Promise<string> {
    const user = await getMockedUserForOrgMembership(membershipOpts);
    return getAuthBearer(user);
}

export async function getMockedProducts(
    prodOpts?: Record<string, unknown>
): Promise<Product[]> {
    ProductsDataModel.initialize(await getSequelize());
    const opts: Record<string, unknown> = {};
    if (prodOpts) {
        const whereOpts: Record<string, unknown> = {};
        if (prodOpts.organization) {
            const org = prodOpts.organization as Organization;
            whereOpts.organizationId = org.id;
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
    ProductsDataModel.initialize(await getSequelize());
    const variant = getRandomVariant();
    const organization = prodOpts?.organization as Organization || await getMockedOrg();
    const isPublic = prodOpts?.public !== undefined ? prodOpts.public : false;
    try {
        const newProd = await ProductsDataModel.create({
            organizationId: organization.id,
            organization: organization,
            name: `Product - ${variant}`,
            description: `This is a mocked product created for testing at ${variant}`,
            public: isPublic
        });
        return ProductsDataModel.toProduct(newProd);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedProduct(prodOpts);
        }
        throw error;
    }
}

export async function getMockedProductMemberships(
    membershipOpts?: Record<string, unknown>
): Promise<Membership<Product>[]> {
    ProductMembershipsDataModel.initialize(await getSequelize());
    const opts: Record<string, unknown> = {};
    if (membershipOpts) {
        const whereOpts: Record<string, unknown> = {};
        if (membershipOpts.entity) {
            const product = membershipOpts.entity as Product;
            whereOpts.productId = product.id;
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
    return (await ProductMembershipsDataModel.findAll(opts)).map(
        m => ProductMembershipsDataModel.toProductMembership(m)
    );
}

export async function getMockedProductMembership(
    membershipOpts?: Record<string, unknown>
): Promise<Membership<Organization>> {
    OrgMembershipsDataModel.initialize(await getSequelize());
    ProductMembershipsDataModel.initialize(await getSequelize());
    const user = membershipOpts?.user as User || await getMockedUser();
    const entity = membershipOpts?.entity as Product || await getMockedProduct();
    const role = membershipOpts?.role || ProductRole.STAKEHOLDER;
    try {
        await OrgMembershipsDataModel.create({
            userId: user.id,
            user,
            productId: (entity.organization as Organization).id,
            entity: entity.organization,
            role: OrganizationRole.MEMBER
        });
        const newMembership = await ProductMembershipsDataModel.create({
            userId: user.id,
            user,
            productId: entity.id,
            entity,
            role
        });
        return ProductMembershipsDataModel.toProductMembership(newMembership);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedProductMembership(membershipOpts);
        }
        throw error;
    }
}

export async function getMockedUserForProductMembership(
    membershipOpts?: Record<string, unknown>
): Promise<User> {
    return (await getMockedProductMembership(membershipOpts)).user;
}

export async function getMockedAuthBearerForProductMembership(
    membershipOpts?: Record<string, unknown>
): Promise<string> {
    const user = await getMockedUserForProductMembership(membershipOpts);
    return getAuthBearer(user);
}

export async function getMockedPersonas(product: Product): Promise<Persona[]> {
    PersonasDataModel.initialize(await getSequelize());
    return (await PersonasDataModel.findAll({ where: { productId: product.id }})).map(
        p => PersonasDataModel.toPersona(p)
    );
}

export async function getMockedPersona(product: Product): Promise<Persona> {
    PersonasDataModel.initialize(await getSequelize());
    const variant = getRandomVariant();
    try {
        const newPersona = await PersonasDataModel.create({
            productId: product.id,
            product,
            name: `Persona - ${variant}`,
            description: `This is a mocked persona created for testing at ${variant}`,
            avatar: `avatar-${variant}`
        });

        return PersonasDataModel.toPersona(newPersona);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedPersona(product);
        }
        throw error;
    }
}

export async function getMockedFeatures(product: Product): Promise<Feature[]> {
    FeaturesDataModel.initialize(await getSequelize());
    return (await FeaturesDataModel.findAll({ where: { productId: product.id }})).map(
        f => FeaturesDataModel.toFeature(f)
    );
}

export async function getMockedFeature(product: Product): Promise<Feature> {
    FeaturesDataModel.initialize(await getSequelize());
    const variant = getRandomVariant();
    try {
        const newFeature = await FeaturesDataModel.create({
            productId: product.id,
            product,
            name: `Feature - ${variant}`,
            description: `This is a mocked feature created for testing at ${variant}`
        });
        return FeaturesDataModel.toFeature(newFeature);
    }  catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // if we get a constraint error, try again
            return getMockedFeature(product);
        }
        throw error;
    }
}
