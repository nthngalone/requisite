import User from '@requisite/model/lib/user/User';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import { assertIsNotEmptyList } from '@requisite/utils/lib/validation/AssertionUtils';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export function getClient(): AxiosInstance {
    const { E2E_TESTS_REQUISITE_BASE_URL } = process.env;
    return axios.create({
        baseURL: `${E2E_TESTS_REQUISITE_BASE_URL}/api`,
        validateStatus: function() {
            return true;
        }
    });
}

export function getSecuredClient(
    domain: string,
    userName: string,
    password: string
): Promise<AxiosInstance> {
    return new Promise((resolve, reject) => {
        const client = getClient();
        client.post('/security/login', {
            domain,
            userName,
            password
        }).then(({ headers }) => {
            const token = headers['x-authorization'];
            client.interceptors.request.use(
                (req: AxiosRequestConfig) => {
                    req.headers.Authorization = `Bearer ${token}`;
                    return req;
                }
            );
            resolve(client);
        }).catch(reject);
    });

}

export async function getSystemAdminUser(): Promise<User> {
    const {
        SYSADMIN_DOMAIN,
        SYSADMIN_USERNAME,
        SYSADMIN_PASSWORD
    } = process.env;
    const client = await getSecuredClient(
        SYSADMIN_DOMAIN,
        SYSADMIN_USERNAME,
        SYSADMIN_PASSWORD
    );
    const { data } = await client.get('/system/admins');
    const systemAdmins = data as SystemAdmin[];
    assertIsNotEmptyList(systemAdmins, 'systemAdmins');
    return systemAdmins[0].user;
}
