import { Request } from '../src/utils/HttpClient';
import MockAdapter from 'axios-mock-adapter';
import AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';
import { isNotBlank } from '@requisite/utils/lib/lang/StringUtils';

const invalidAuthResponse = {
    message: 'Not Authenticated'
};
const validAuthResponse = {
    message: 'Authenticated'
};
const validRegistrationResponse = {
    token: 'im-a-token',
    message: 'Registered'
};
const userNameConflictRegistrationResponse = {
    message: 'Conflict',
    conflictReason: 'userName'
};
const emailConflictRegistrationResponse = {
    message: 'Conflict',
    conflictReason: 'emailAddress'
};
const users: Record<string, any> = {
    user: {
        profile: {
            userName: 'user',
            password: 'password',
            emailAddress: 'user@org.com',
            name: {
                firstName: 'First',
                lastName: 'Last'
            }
        }
    },
    expired: {
        authResponse: {
            message: 'Credentials Expired'
        }
    }
};

export function extendAdapterForSecurity(mockAdapter: MockAdapter): void {

    mockAdapter.onPost('/api/security/login').reply((config: Request) => {
        const { userName, password } = (JSON.parse(config.data) as AuthenticationRequest);
        const user = users[userName];
        let response;
        let status = 500;
        let headers = null;
        if (user) {
            if (user.profile && user.profile.password === password) {
                response = validAuthResponse;
                status = 200;
                headers = {
                    'x-authorization': JSON.stringify(user)
                };
            } else if (user.authResponse) {
                response = user.authResponse;
                status = 200;
            } else {
                response = invalidAuthResponse;
                status = 401;
            }
        } else {
            response = invalidAuthResponse;
            status = 401;
        }
        return [status, response, headers];
    });

    mockAdapter.onPost('/api/security/register').reply((config: Request) => {
        const registrationRequest = (JSON.parse(config.data) as RegistrationRequest);
        let status = 500;
        let response;
        if (users[registrationRequest.userName]) {
            status = 409;
            response = userNameConflictRegistrationResponse;
        } else if (users[registrationRequest.emailAddress]) {
            status = 409;
            response = emailConflictRegistrationResponse;
        } else {
            users[registrationRequest.userName] = { profile: registrationRequest };
            users[registrationRequest.emailAddress] = { profile: registrationRequest };
            status = 201;
            response = validRegistrationResponse;
        }
        return [status, response];
    });

    mockAdapter.onGet('/api/security/user').reply((config: Request) => {
        const auth = config.headers?.Authorization as string;
        let status = 401;
        let response = null;
        if (isNotBlank(auth) && auth.length > 7) {
            const token = auth.substring(7);
            status = 200;
            response = JSON.parse(token).profile;
        }
        return [status, response];
    });

    mockAdapter.onGet('/api/security/context').reply((config: Request) => {
        const auth = config.headers?.Authorization as string;
        let status = 401;
        let response = null;
        if (isNotBlank(auth) && auth.length > 7) {
            const token = auth.substring(7);
            status = 200;
            response = {
                user: JSON.parse(token).profile,
                systemAdmin: false,
                orgMemberships: [],
                productMemberships: []
            };
        }
        return [status, response];
    });
}
