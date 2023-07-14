import { SystemRole } from '@requisite/model/lib/user/Membership';
import SystemAdmin, { System } from '@requisite/model/lib/user/SystemAdmin';
import User from '@requisite/model/lib/user/User';
import {
    Sequelize,
    Model,
    DataTypes,
    Association
} from 'sequelize';
import {
    enableCreateUpdateDataModelTransformation,
    enableDataModelLogging,
    enableFindIncludeOptions
} from '../SqlzUtils';
import UsersDataModel from './UsersDataModel';

const tableName = 'systemAdmins';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.VIRTUAL
    }
};

export default class SystemAdminsDataModel extends Model implements SystemAdmin {

    entity: System = { };
    role: SystemRole = SystemRole.ADMIN;

    id: number;
    userId: number;
    user: User;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        user: Association<SystemAdminsDataModel, UsersDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        SystemAdminsDataModel.init(columnMappings, { sequelize, tableName });
        SystemAdminsDataModel.belongsTo(UsersDataModel, {
            as: 'user',
            foreignKey: 'userId'
        });
    }

    public static toDataModel(systemAdmin: SystemAdmin): SystemAdminsDataModel {
        return {
            ...systemAdmin,
            userId: systemAdmin.user.id
        } as SystemAdminsDataModel;
    }

    public static toSystemAdmin(model: SystemAdminsDataModel): SystemAdmin {
        const sysAdmin = model.toJSON ? model.toJSON() : model;
        const { id, domain, userName, emailAddress, name } = sysAdmin.user || {};
        sysAdmin.user = { id, domain, userName, emailAddress, name } as User;
        delete sysAdmin.userId;
        delete sysAdmin.createdAt;
        delete sysAdmin.updatedAt;
        delete sysAdmin.updatedBy;
        return sysAdmin;
    }

}

enableDataModelLogging(SystemAdminsDataModel);

enableFindIncludeOptions(SystemAdminsDataModel, () => [
    { association: SystemAdminsDataModel.associations.user }
]);

enableCreateUpdateDataModelTransformation(SystemAdminsDataModel, (data) => {
    return SystemAdminsDataModel.toDataModel(data);
});
