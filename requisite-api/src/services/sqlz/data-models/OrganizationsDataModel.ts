import Organization from '@requisite/model/lib/org/Organization';
import { enableDataModelLogging, getDataGettersAndSetters } from '../SqlzUtils';
import {
    Sequelize,
    Model,
    DataTypes
} from 'sequelize';
import User from '@requisite/model/lib/user/User';

const tableName = 'organizations';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: {
        type: DataTypes.JSONB
    },
    name: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('name')
    }
};

export default class OrganizationsDataModel extends Model implements Organization {

    id: number;
    name: string;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static initialize(sequelize: Sequelize): void {
        OrganizationsDataModel.init(columnMappings, { sequelize, tableName });
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toOrganization(model: OrganizationsDataModel): Organization {
        const org = model.toJSON ? model.toJSON() : model;
        delete org.data;
        delete org.createdAt;
        delete org.updatedAt;
        delete org.updatedBy;
        return org;
    }
}

enableDataModelLogging(OrganizationsDataModel);
