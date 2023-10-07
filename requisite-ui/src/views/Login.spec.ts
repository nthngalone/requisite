import router from '../router';
import Login from '../views/Login.vue';
import LoginPageObject from '@requisite/page-objects/lib/views/LoginPageObject';
import { getMountedDriver } from '../../tests/unit/VueWrapperDriver';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';
import AuthenticationResponse from '@requisite/model/lib/user/AuthenticationResponse';
import AuthenticationRequest from '@requisite/model/lib/user/AuthenticationRequest';
import '../../tests/unit/matchMediaShim';
import '../../tests/unit/consoleOverrides';

jest.mock('../services/SecurityService', () => {
    return class {
        async login(authenticationRequest: AuthenticationRequest):
            Promise<AuthenticationResponse> {
            switch (authenticationRequest.userName) {
                case 'valid':
                    return Promise.resolve({
                        message: 'Authenticated',
                        token: 'valid-token'
                    });
                default:
                    return Promise.reject(new Error('error'));
            }
        }

        async register():
            Promise<RegistrationResponse> {
            throw new Error('unsupported operation');
        }
    };
});

describe('./views/Login.vue', () => {

    it('routes to /home when an authenticated event is received', async () => {
        const driver = getMountedDriver({
            component: Login,
            router,
        });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new LoginPageObject(driver);
        await pageObj.login('valid', 'pass');
        await driver.nextRender();
        expect(driver.router().push).toHaveBeenCalledWith('/home');
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays a system error alert when a system error event is received', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getMountedDriver({
            component: Login,
            router,
        });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new LoginPageObject(driver);
        await pageObj.login('error', 'pass');
        await driver.nextRender();
        expect(driver.router().push).not.toHaveBeenCalled();
        expect(pageObj.systemErrorExists()).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
    });
});
