import type SystemService from './SystemService';
import UsersDataModel from './sqlz/data-models/UsersDataModel';
import { runWithSequelize } from './sqlz/SqlzUtils';
import OrganizationsDataModel from './sqlz/data-models/OrganizationsDataModel';
import SystemAdminsDataModel from './sqlz/data-models/SystemAdminsDataModel';
import { NotFoundError } from '../util/ApiErrors';
import type SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import ProductsDataModel from './sqlz/data-models/ProductsDataModel';
import { getLogger } from '../util/Logger';
import PersonasDataModel from './sqlz/data-models/PersonasDataModel';
import StoriesDataModel from './sqlz/data-models/StoriesDataModel';
import StoryRevisionsDataModel from './sqlz/data-models/StoryRevisionsDataModel';
import FeaturesDataModel from './sqlz/data-models/FeaturesDataModel';
import type User from '@requisite/model/lib/user/User';
import OrgMembershipsDataModel from './sqlz/data-models/OrgMembershipsDataModel';
import ProductMembershipsDataModel from './sqlz/data-models/ProductMembershipsDataModel';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/SystemServiceSqlzImpl');

export default class SystemServiceSqlzImpl implements SystemService {
    async initializeSystem(): Promise<void> {
        await runWithSequelize(async (sqlz) => {

            UsersDataModel.initialize(sqlz);
            await UsersDataModel.sync();

            OrganizationsDataModel.initialize(sqlz);
            await OrganizationsDataModel.sync();

            OrgMembershipsDataModel.initialize(sqlz);
            await OrgMembershipsDataModel.sync();

            SystemAdminsDataModel.initialize(sqlz);
            await SystemAdminsDataModel.sync();

            ProductsDataModel.initialize(sqlz);
            await ProductsDataModel.sync();

            ProductMembershipsDataModel.initialize(sqlz);
            await ProductMembershipsDataModel.sync();

            PersonasDataModel.initialize(sqlz);
            await PersonasDataModel.sync();

            FeaturesDataModel.initialize(sqlz);
            await FeaturesDataModel.sync();

            StoriesDataModel.initialize(sqlz);
            await StoriesDataModel.sync();

            StoryRevisionsDataModel.initialize(sqlz);
            await StoryRevisionsDataModel.sync();

        });
    }
    async listSystemAdmins(): Promise<SystemAdmin[]> {
        return (await runWithSequelize(async (sqlz) => {
            SystemAdminsDataModel.initialize(sqlz);
            return SystemAdminsDataModel.findAll();
        })).map(sysAdmin => SystemAdminsDataModel.toSystemAdmin(sysAdmin));
    }
    async addSystemAdmin(user: User): Promise<SystemAdmin> {
        return runWithSequelize(async (sqlz) => {
            SystemAdminsDataModel.initialize(sqlz);
            const { id } = await SystemAdminsDataModel.create({ user });
            return SystemAdminsDataModel.toSystemAdmin(
                (await SystemAdminsDataModel.findByPk(id))
            );
        });
    }
    async removeSystemAdmin(id: number): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            SystemAdminsDataModel.initialize(sqlz);
            return SystemAdminsDataModel.destroy({ where: { id } });
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }
}
