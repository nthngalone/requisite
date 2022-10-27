import Organization from '@requisite/model/lib/org/Organization';
import { getHttpClient, returnData } from '../utils/HttpClient';

export default class UserService {

    async getOrgs():
        Promise<Organization[]> {
        return getHttpClient().get(
            '/api/user/orgs'
        ).then(returnData<Organization[]>());
    }
}
