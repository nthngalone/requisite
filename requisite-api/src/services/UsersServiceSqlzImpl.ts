import User from '@requisite/model/lib/user/User';
import { NotFoundError } from '../util/ApiErrors';
import UsersService, { UserSearchCriteria } from './UsersService';
import UsersDataModel from './sqlz/data-models/UsersDataModel';
import { runWithSequelize } from './sqlz/SqlzUtils';
import { WhereOptions } from 'sequelize/types';
import { assertIsNotBlank } from '@requisite/utils/lib/validation/AssertionUtils';

export default class UsersServiceSqlzImpl implements UsersService {
    async listUsers(): Promise<User[]> {
        return (await runWithSequelize(async (sqlz) => {
            UsersDataModel.initialize(sqlz);
            return UsersDataModel.findAll();
        })).map(data => UsersDataModel.toUser(data));
    }
    async getUser(criteria: UserSearchCriteria): Promise<User> {
        const user = await runWithSequelize(async (sqlz) => {
            UsersDataModel.initialize(sqlz);
            const { id, domain, userName, emailAddress } = criteria;
            if (userName) {
                assertIsNotBlank(domain, 'domain must be included in user search criteria if searching on userName');
            }
            const where: WhereOptions = {};
            if (id) {
                where.id = id;
            }
            if (userName) {
                where.domain = domain;
                where.userName = userName;
            }
            if (emailAddress) {
                where.emailAddress = emailAddress;
            }
            return UsersDataModel.findOne( { where });
        });
        return user ? UsersDataModel.toUser(user) : null;
    }
    async deleteUser(id: number): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            UsersDataModel.initialize(sqlz);
            return UsersDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }
}
