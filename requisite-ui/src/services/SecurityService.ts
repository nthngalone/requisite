import AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import AuthenticationResponse from '@requisite/model/lib/user/AuthenticationResponse';
import RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';
import SecurityContext from '@requisite/model/lib/user/SecurityContext';
import { getHttpClient, returnData } from '../utils/HttpClient';
import { removeAuthToken } from '../utils/AuthTokenManager';
import { cached, uncached } from './CacheService';

const CACHE_KEY_CONTEXT = 'context';

export default class SecurityService {
    async login(authenticationRequest: AuthenticationRequest):
        Promise<AuthenticationResponse> {

        return getHttpClient().post(
            '/api/security/login',
            authenticationRequest
        ).then(returnData<AuthenticationResponse>());
    }

    async register(registrationRequest: RegistrationRequest):
        Promise<RegistrationResponse> {

        return getHttpClient().post(
            '/api/security/register',
            registrationRequest
        ).then(returnData<RegistrationResponse>());
    }

    async getContext(): Promise<SecurityContext> {
        return cached(CACHE_KEY_CONTEXT, () => {
            return getHttpClient().get(
                '/api/security/context'
            ).then(returnData<SecurityContext>());
        });
    }

    async logout(): Promise<void> {
        uncached(CACHE_KEY_CONTEXT);
        removeAuthToken();
    }

}
