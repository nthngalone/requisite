import Name from '@requisite/model/lib/common/Name';
import User from '@requisite/model/lib/user/User';
import {
    Sequelize,
    Model,
    DataTypes
} from 'sequelize';
import { enableDataModelLogging, getDataGettersAndSetters } from '../SqlzUtils';

const tableName = 'users';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    domain: {
        type: DataTypes.STRING
    },
    userName: {
        type: DataTypes.STRING
    },
    emailAddress: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    data: {
        type: DataTypes.JSONB
    },
    name: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('name')
    },
    avatar: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('avatar')
    },
    expired: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('expired')
    },
    locked: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('locked')
    },
    revoked: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('revoked')
    }
};

const defaultScope = {
    attributes: { exclude: ['password'] }
};

const indexes = [{
    unique: true,
    fields: ['domain', 'userName']
}];

interface Credential {
    password: string;
}

export default class UsersDataModel extends Model implements User, Credential {

    id: number;
    domain: string;
    userName: string;
    name: Name;
    emailAddress: string;
    avatar: string;
    expired: boolean;
    locked: boolean;
    revoked: boolean;
    password: string;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static initialize(sequelize: Sequelize): void {
        UsersDataModel.init(
            columnMappings,
            { sequelize, tableName, defaultScope, indexes }
        );
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toUser(model: UsersDataModel): User {
        const user = model.toJSON ? model.toJSON() : model;
        delete user.data;
        delete user.createdAt;
        delete user.updatedAt;
        delete user.password;
        return user;
    }
}

enableDataModelLogging(UsersDataModel);
