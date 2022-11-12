import Entity from '@requisite/model/lib/Entity';
import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';
import Membership, { OrganizationRole, ProductRole, SystemRole } from '@requisite/model/lib/user/Membership';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';
import { asyncForEachSerial } from '@requisite/utils/lib/lang/ArrayUtils';
import { assertExists, assertFalse } from '@requisite/utils/lib/validation/AssertionUtils';
import { Association, ModelAttributeColumnOptions, IndexesOptions, InitOptions } from 'sequelize/types';

jest.mock('sequelize', () => {

    class ConstraintError extends Error {
        fields: string[];
        constructor(field: string) {
            super();
            this.name = 'SequelizeUniqueConstraintError';
            this.fields = [field];
        }
    }

    class MockModel<T extends Entity> {
        private entities: T[];
        private nextId: number;
        private entityMixins: Record<string, unknown>;
        private entityUniqueKeys: string[][];
        constructor(
            initialEntities: T[],
            entityUniqueKeys: string[][]
        ) {
            this.entityMixins = {
                toJSON(): unknown {
                    const json = { ...this };
                    delete json.toJSON;
                    return json;
                }
            };
            this.entities = initialEntities.map((entity) => {
                return {
                    ...entity,
                    ...this.entityMixins
                } as T;
            });
            this.nextId = initialEntities.length + 1;
            this.entityUniqueKeys = entityUniqueKeys;
        }
        async findAll(opts?: Record<string, Record<string, unknown>>): Promise<T[]> {
            if (opts && opts.where) {
                const { where } = opts;
                // If any of the where fields equal 'error', throw an exception
                assertFalse(Object.keys(where).some(key => where[key] === 'error'), 'where clause contains error');
                return this.entities.filter((entity) => {
                    return Object.keys(where).every((key) => {
                        return (entity as Record<string, unknown>)[key] === where[key];
                    });
                });
            } else {
                return this.entities;
            }
        }
        async findByPk(id: number): Promise<T | undefined> {
            return this.entities.find(entity => entity.id === id);
        }
        async findOne(
            opts: Record<string, Record<string, unknown>>
        ): Promise<T | undefined> {
            const { where } = opts;
            // If any of the where fields equal 'error', throw an exception
            assertFalse(Object.keys(where).some(key => where[key] === 'error'), 'where clause contains error');
            return this.entities.find((entity) => {
                return Object.keys(where).every((key) => {
                    return (entity as Record<string, unknown>)[key] === where[key];
                });
            });
        }
        async create(entity: T): Promise<T> {
            await asyncForEachSerial(this.entityUniqueKeys, async (keys) => {
                const where = {} as Record<string, unknown>;
                (keys as string[]).forEach(key => {
                    where[key] = (entity as Record<string, unknown>)[key];
                });
                const conflict = await this.findOne({ where });
                if (conflict) {
                    throw new ConstraintError(JSON.stringify(keys));
                }
            });
            const newEntity = {
                ...entity,
                ...this.entityMixins,
                id: this.nextId++
            } as T;
            this.entities.push(newEntity);
            return newEntity;
        }
        async update(entity: T): Promise<number[]> {
            const index = this.entities.findIndex(o => o.id === entity.id);
            if (index >= 0) {
                this.entities[index] = {
                    ...entity,
                    ...this.entityMixins
                } as unknown as T;
                return [1];
            } else {
                return [0];
            }
        }
        async destroy(opts: Record<string, Record<string, number>>):
            Promise<number> {
            const { where } = opts;
            const index = this.entities.findIndex(o => o.id === where.id);
            return (index >= 0) ? this.entities.splice(index, 1).length : 0;
        }
    }

    const mockModels = {} as Record<string, MockModel<Entity>>;

    const mockOrgs: Organization[] = [{
        id: 0,
        name: 'Organization 0'
    } as Organization, {
        id: 1,
        name: 'Organization 1'
    } as Organization];

    const mockProducts: Product[] = [{
        id: 0,
        organizationId: mockOrgs[0].id,
        organization: mockOrgs[0],
        name: 'Org-0-Product-0-Private',
        description: 'Org-0-Product-0-Private',
        public: false,
    } as unknown as Product, {
        id: 1,
        organizationId: mockOrgs[0].id,
        organization: mockOrgs[0],
        name: 'Org-0-Product-1-Public',
        description: 'Org-0-Product-1-Public',
        public: true,
    } as unknown as Product, {
        id: 2,
        organizationId: mockOrgs[1].id,
        organization: mockOrgs[1],
        name: 'Org-1-Product-2-Private',
        description: 'Org-1-Product-2-Private',
        public: false,
    } as unknown as Product, {
        id: 3,
        organizationId: mockOrgs[1].id,
        organization: mockOrgs[1],
        name: 'Org-1-Product-3-Private',
        description: 'Org-1-Product-3-Private',
        public: false,
    } as unknown as Product];

    const mockUsers: Record<string, User> = {

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
        } as unknown as User
    };

    const mockSysAdmins: SystemAdmin[] = [{
        id: 0,
        userId: mockUsers.sysadmin.id,
        user: mockUsers.sysadmin, // sysadmin
        entity: {},
        role: SystemRole.ADMIN
    } as unknown as SystemAdmin];

    const mockOrgMemberships: Membership<Organization>[] = [];
    const mockProductMemberships: Membership<Product>[] = [];

    Object.values(mockUsers).forEach((user) => {

        // Map org memberships from the users
        const orgMemberships =
            (user as unknown as Record<string, Membership<Organization>[]>)
                .orgMemberships;
        orgMemberships.forEach((membership) => {
            mockOrgMemberships.push({
                ...membership,
                id: mockOrgMemberships.length,
                userId: user.id,
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
                user
            } as unknown as Membership<Product>);
        });
    });

    return {
        Sequelize: class {
            authenticate(): Promise<void> { return Promise.resolve(); }
            close(): Promise<void> { return Promise.resolve(); }
        },
        Model: class {
            static init(
                columnMappings: Record<string, ModelAttributeColumnOptions>,
                options: InitOptions
            ): void {
                if (!mockModels[this.name]) {
                    const uniqueKeys: string[][] =
                        Object.keys(columnMappings).reduce(
                            (saved: string[][], key: string) => {
                                if (columnMappings[key].unique) {
                                    saved.push([key]);
                                }
                                return saved;
                            },
                            []
                        );
                    if (options) {
                        const indexesOptions: readonly IndexesOptions[] =
                            options.indexes || [];
                        const uniqueKeySets = indexesOptions
                            .filter((index: IndexesOptions) => index.unique)
                            .map((index: IndexesOptions) => index.fields as string[]);
                        uniqueKeys.push(...uniqueKeySets);
                    }
                    switch(this.name) {
                        case 'OrganizationsDataModel':
                            mockModels[this.name] = new MockModel<Organization>(
                                // initial organization data
                                mockOrgs,
                                // organization unique keys (if any)
                                uniqueKeys
                            );
                            break;
                        case 'UsersDataModel':
                            mockModels[this.name] = new MockModel<User>(
                                // initial user data
                                Object.values(mockUsers).map(value => value),
                                // user unique keys (if any)
                                uniqueKeys
                            );
                            break;
                        case 'SystemAdminsDataModel':
                            mockModels[this.name] = new MockModel<SystemAdmin>(
                                // initial system admin data
                                mockSysAdmins,
                                // system admin unique keys (if any)
                                uniqueKeys
                            );
                            break;
                        case 'OrgMembershipsDataModel':
                            mockModels[this.name] =
                                new MockModel<Membership<Organization>>(
                                    // initial org membership data
                                    mockOrgMemberships,
                                    // org membership unique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        case 'ProductMembershipsDataModel':
                            mockModels[this.name] =
                                new MockModel<Membership<Product>>(
                                    // initial product membership data
                                    mockProductMemberships,
                                    // product membership unique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        case 'ProductsDataModel':
                            mockModels[this.name] =
                                new MockModel<Product>(
                                    // initial product data
                                    mockProducts,
                                    // product membership unique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        default:
                            throw new Error(`mock init not implememented yet for ${this.name}`);
                    }
                }
            }
            static async findAll(
                opts?: Record<string, Record<string, unknown>>
            ): Promise<Entity[]> {
                assertExists(mockModels[this.name], `mockModels['${this.name}']`);
                return mockModels[this.name].findAll(opts);
            }
            static async findOne(
                opts: Record<string, Record<string, unknown>>
            ): Promise<Entity | undefined> {
                assertExists(mockModels[this.name], `mockModels['${this.name}']`);
                return mockModels[this.name].findOne(opts);
            }
            static async findByPk(pk: number): Promise<Entity | undefined> {
                assertExists(mockModels[this.name], `mockModels['${this.name}']`);
                return mockModels[this.name].findByPk(pk);
            }
            static async create(data: Entity): Promise<Entity> {
                assertExists(mockModels[this.name], `mockModels['${this.name}']`);
                return mockModels[this.name].create(data);
            }
            static async update(data: Entity): Promise<number[]> {
                assertExists(mockModels[this.name], `mockModels['${this.name}']`);
                return mockModels[this.name].update(data);
            }
            static async destroy(opts: Record<string, Record<string, number>>):
                Promise<number> {
                assertExists(mockModels[this.name], `mockModels['${this.name}']`);
                return mockModels[this.name].destroy(opts);
            }
            static belongsTo(): void { return; }
            static associations: { [key: string]: Association; } = {};
        },
        DataTypes: {}
    };
});
