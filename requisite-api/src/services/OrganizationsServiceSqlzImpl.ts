import { NotFoundError } from '../util/ApiErrors';
import type OrganizationsService from './OrganizationsService';
import type Organization from '@requisite/model/lib/org/Organization';
import OrganizationsDataModel from './sqlz/data-models/OrganizationsDataModel';
import { runWithSequelize } from './sqlz/SqlzUtils';
import { getLogger } from '../util/Logger';
import type Membership from '@requisite/model/lib/user/Membership';
import OrgMembershipsDataModel from './sqlz/data-models/OrgMembershipsDataModel';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/OrganizationsServiceSqlzImpl');

export default class OrganizationsServiceSqlzImpl implements OrganizationsService {

    async listOrgs(): Promise<Organization[]> {
        return (await runWithSequelize(async (sqlz) => {
            OrganizationsDataModel.initialize(sqlz);
            return OrganizationsDataModel.findAll();
        })).map(data => OrganizationsDataModel.toOrganization(data));
    }
    async getOrg(id: number): Promise<Organization> {
        const org = await runWithSequelize(async (sqlz) => {
            OrganizationsDataModel.initialize(sqlz);
            return OrganizationsDataModel.findByPk(id);
        });
        return org ? OrganizationsDataModel.toOrganization(org) : null;
    }
    async createOrg(org: Organization): Promise<Organization> {
        return OrganizationsDataModel.toOrganization(
            await runWithSequelize(async (sqlz) => {
                OrganizationsDataModel.initialize(sqlz);
                return OrganizationsDataModel.create({ ...org });
            })
        );
    }
    async updateOrg(org: Organization): Promise<Organization> {
        const [count] = await runWithSequelize(async (sqlz) => {
            OrganizationsDataModel.initialize(sqlz);
            const { id } = org;
            return OrganizationsDataModel.update(
                org,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return org;
    }
    async deleteOrg(organization: Organization): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = organization;
            OrganizationsDataModel.initialize(sqlz);
            return OrganizationsDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }

    async listMemberships(org: Organization): Promise<Membership<Organization>[]> {
        return (await runWithSequelize(async (sqlz) => {
            OrgMembershipsDataModel.initialize(sqlz);
            return OrgMembershipsDataModel.findAll({
                where: { orgId: org.id }
            });
        })).map(
            membership => OrgMembershipsDataModel.toOrgMembership(membership)
        );
    }
    async getMembership(id: number): Promise<Membership<Organization>> {
        const membership = await runWithSequelize(async (sqlz) => {
            OrgMembershipsDataModel.initialize(sqlz);
            return OrgMembershipsDataModel.findByPk(id);
        });
        return membership ? OrgMembershipsDataModel.toOrgMembership(membership) : null;
    }
    async addMembership(
        membership: Membership<Organization>
    ): Promise<Membership<Organization>> {
        return OrgMembershipsDataModel.toOrgMembership(
            await runWithSequelize(async (sqlz) => {
                OrgMembershipsDataModel.initialize(sqlz);
                const { id } = await OrgMembershipsDataModel.create({ ...membership });
                return OrgMembershipsDataModel.findByPk(id);
            })
        );
    }
    async updateMembership(
        membership: Membership<Organization>
    ): Promise<Membership<Organization>> {
        const [count] = await runWithSequelize(async (sqlz) => {
            OrgMembershipsDataModel.initialize(sqlz);
            const { id } = membership;
            return OrgMembershipsDataModel.update(
                membership,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return membership;
    }
    async removeMembership(
        membership: Membership<Organization>
    ): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = membership;
            OrgMembershipsDataModel.initialize(sqlz);
            return OrgMembershipsDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }
}
