import Entity from '@requisite/model/lib/Entity';
import Organization from '@requisite/model/lib/org/Organization';
import Feature from '@requisite/model/lib/product/Feature';
import Persona from '@requisite/model/lib/product/Persona';
import Product from '@requisite/model/lib/product/Product';
import Membership from '@requisite/model/lib/user/Membership';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';
import { asyncForEachSerial } from '@requisite/utils/lib/lang/ArrayUtils';
import { assertExists, assertFalse } from '@requisite/utils/lib/validation/AssertionUtils';
import { Association, ModelAttributeColumnOptions, IndexesOptions, InitOptions } from 'sequelize';
import {
    mockOrgMemberships,
    mockOrgs,
    mockProductMemberships,
    mockProducts,
    mockSysAdmins,
    mockUsers,
    mockPersonas,
    mockFeatures,
    mockStories,
    mockStoryRevisions
} from './mockData';
import Story from '@requisite/model/lib/story/Story';
import StoryRevision from '@requisite/model/lib/story/StoryRevision';

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
                                    // product unique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        case 'PersonasDataModel':
                            mockModels[this.name] =
                                new MockModel<Persona>(
                                    // initial persona data
                                    mockPersonas,
                                    // personaunique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        case 'FeaturesDataModel':
                            mockModels[this.name] =
                                new MockModel<Feature>(
                                    // initial feature data
                                    mockFeatures,
                                    // feature unique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        case 'StoriesDataModel':
                            mockModels[this.name] =
                                new MockModel<Story>(
                                    // initial feature data
                                    mockStories,
                                    // feature unique keys (if any)
                                    uniqueKeys
                                );
                            break;
                        case 'StoryRevisionsDataModel':
                            mockModels[this.name] =
                                new MockModel<StoryRevision>(
                                    // initial feature data
                                    mockStoryRevisions,
                                    // feature unique keys (if any)
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
            static hasMany(): void { return; }
            static associations: { [key: string]: Association; } = {};
        },
        DataTypes: {}
    };
});
