import Membership, { OrganizationRole } from '@requisite/model/lib/user/Membership';
import Organization from '@requisite/model/lib/org/Organization';
import {
    Sequelize,
    Model,
    DataTypes,
    Association
} from 'sequelize';
import UsersDataModel from './UsersDataModel';
import OrganizationsDataModel from './OrganizationsDataModel';
import User from '@requisite/model/lib/user/User';
import {
    enableCreateUpdateDataModelTransformation,
    enableDataModelLogging,
    enableFindIncludeOptions,
} from '../SqlzUtils';

const tableName = 'orgMemberships';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    orgId: {
        type: DataTypes.INTEGER,
    },
    role: {
        type: DataTypes.STRING,
        enum: OrganizationRole
    }
};

export default class OrgMembershipsDataModel
    extends Model implements Membership<Organization> {

    id: number;
    userId: number;
    user: UsersDataModel;
    orgId: number;
    entity: OrganizationsDataModel;
    role: OrganizationRole;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        user: Association<OrgMembershipsDataModel, UsersDataModel>,
        entity: Association<OrgMembershipsDataModel, OrganizationsDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        OrgMembershipsDataModel.init(columnMappings, { sequelize, tableName });
        OrgMembershipsDataModel.belongsTo(UsersDataModel, {
            foreignKey: 'userId', // belongsTo - foreign key belongs to local table
            as: 'user'
        });
        OrgMembershipsDataModel.belongsTo(OrganizationsDataModel, {
            foreignKey: 'orgId', // belongsTo - foreign key belongs to local table
            as: 'entity'
        });
    }

    public static toDataModel(
        orgMembership: Membership<Organization>
    ): OrgMembershipsDataModel {
        return {
            ...orgMembership,
            orgId: orgMembership.entity.id,
            userId: orgMembership.user.id
        } as unknown as OrgMembershipsDataModel;
    }

    public static toOrgMembership(
        model: OrgMembershipsDataModel
    ): Membership<Organization> {
        const orgMembership = model.toJSON ? model.toJSON() : model;
        (orgMembership as Membership<Organization>).user
            = UsersDataModel.toUser(orgMembership.user);
        (orgMembership as Membership<Organization>).entity
            = OrganizationsDataModel.toOrganization(orgMembership.entity);
        delete orgMembership.orgId;
        delete orgMembership.userId;
        delete orgMembership.createdAt;
        delete orgMembership.updatedAt;
        delete orgMembership.updatedBy;
        return orgMembership;
    }

}

enableDataModelLogging(OrgMembershipsDataModel);

enableFindIncludeOptions(OrgMembershipsDataModel, () => [
    { association: OrgMembershipsDataModel.associations.entity },
    { association: OrgMembershipsDataModel.associations.user }
]);
enableCreateUpdateDataModelTransformation(OrgMembershipsDataModel, (data) => {
    return OrgMembershipsDataModel.toDataModel(data);
});
