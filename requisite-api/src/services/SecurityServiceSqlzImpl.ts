import type User from '@requisite/model/lib/user/User';
import type AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import type SecurityService from './SecurityService';
import type Logger from '../util/Logger';
import { getLogger } from '../util/Logger';
import type RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';
import type Organization from '@requisite/model/lib/org/Organization';
import { NotAuthenticatedError } from '../util/ApiErrors';
import type Product from '@requisite/model/lib/product/Product';
import type Membership from '@requisite/model/lib/user/Membership';
import bcryptjs from 'bcryptjs';
import { runWithSequelize } from './sqlz/SqlzUtils';
import UsersDataModel from './sqlz/data-models/UsersDataModel';
import SystemAdminsDataModel from './sqlz/data-models/SystemAdminsDataModel';
import OrgMembershipsDataModel from './sqlz/data-models/OrgMembershipsDataModel';
import ProductMembershipsDataModel from './sqlz/data-models/ProductMembershipsDataModel';

const logger: Logger = getLogger('services/SecurityServiceSqlzImpl');

const { hashSync, compareSync } = bcryptjs;

export default class SecurityServiceSqlzImpl implements SecurityService {

    async login(authRequest: AuthenticationRequest): Promise<User> {
        const { domain, userName, password } = authRequest;
        const user = await runWithSequelize(async (sqlz) => {
            logger.debug(`Attempting login for [${domain}/${userName}] with sqlz`);
            UsersDataModel.initialize(sqlz);
            return UsersDataModel.findOne( {
                where: { domain, userName },
                attributes: { include: ['password'] }
            });
        });
        if (!user || !compareSync(password, user.password)) {
            throw new NotAuthenticatedError();
        }
        return UsersDataModel.toUser(user);
    }
    async register(regRequest: RegistrationRequest): Promise<User> {
        return runWithSequelize(async (sqlz) => {
            logger.debug(`Attempting registration for [${regRequest.domain}/${regRequest.userName}] with sqlz`);
            UsersDataModel.initialize(sqlz);
            const password = hashSync(regRequest.password, 5);
            const newUser = await UsersDataModel.create({
                avatar: '',
                name: regRequest.name,
                domain: regRequest.domain,
                userName: regRequest.userName,
                emailAddress: regRequest.emailAddress,
                termsAgreement: true,
                expired: false,
                locked: false,
                password
            });
            return UsersDataModel.toUser(newUser);
        });
    }
    async getOrgMemberships(user: User): Promise<Membership<Organization>[]> {
        return (await runWithSequelize(async (sqlz) => {
            OrgMembershipsDataModel.initialize(sqlz);
            return OrgMembershipsDataModel.findAll({
                where: { userId: user.id }
            });
        })).map(
            membership => OrgMembershipsDataModel.toOrgMembership(membership)
        );
    }
    async getProductMemberships(user: User): Promise<Membership<Product>[]> {
        return (await runWithSequelize(async (sqlz) => {
            ProductMembershipsDataModel.initialize(sqlz);
            return ProductMembershipsDataModel.findAll({
                where: { userId: user.id }
            });
        })).map(
            membership => ProductMembershipsDataModel.toProductMembership(membership)
        );
    }
    async isSystemAdmin(user: User): Promise<boolean> {
        const admin = await runWithSequelize(async (sqlz) => {
            const { id: userId } = user;
            SystemAdminsDataModel.initialize(sqlz);
            return SystemAdminsDataModel.findOne({ where: { userId }});
        });
        return (admin !== null && admin !== undefined);
    }
}
