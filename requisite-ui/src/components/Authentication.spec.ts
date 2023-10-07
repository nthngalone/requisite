import router from '../router';
import Authentication from '../components/Authentication.vue';
import AuthenticationPageObject from '@requisite/page-objects/lib/components/AuthenticationPageObject';
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
                case 'invalid':
                    return Promise.reject(new Error('unauthenticated'));
                case 'expired':
                    return Promise.resolve({
                        message: 'Credentials Expired',
                        token: ''
                    });
                case 'unknown':
                    return Promise.resolve({
                        message: 'Something Unknown Happened',
                        token: ''
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

describe('./components/Authentication.vue', () => {

    it('displays no warnings or errors on mount', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeFalsy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('captures user input for the user name and password', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('user');
        await pageObj.setPassword('pass');
        const data = driver.data();
        expect(data.credentials.userName).toMatch('user');
        expect(data.credentials.password).toMatch('pass');
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays a warning message when login is clicked if a username and password are not provided', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.clickLogin();
        await pageObj.waitForRequiredFieldsValidationWarning(4000);
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays a warning message when login is clicked if only a username is provided', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('user');
        await pageObj.clickLogin();
        await pageObj.waitForRequiredFieldsValidationWarning(4000);
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays a warning message when login is clicked if only a password is provided', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setPassword('pass');
        await pageObj.clickLogin();
        await pageObj.waitForRequiredFieldsValidationWarning(4000);
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays a warning message when login is clicked with invalid credentials', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('invalid');
        await pageObj.setPassword('pass');
        await pageObj.clickLogin();
        await pageObj.waitForInvalidCredentialsWarning(4000);
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeFalsy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeTruthy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays a warning message when login is clicked with expired credentials', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('expired');
        await pageObj.setPassword('pass');
        await pageObj.clickLogin();
        await pageObj.waitForExpiredCredentialsWarning(4000);
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeFalsy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeTruthy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('emits an error message when login is clicked and the server fails', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('error');
        await pageObj.setPassword('pass');
        await pageObj.clickLogin();
        await driver.nextRender();
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeFalsy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('emits an error message when login is clicked and an unknown response is received', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('unknown');
        await pageObj.setPassword('pass');
        await pageObj.clickLogin();
        await driver.nextRender();
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeFalsy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('emits an authenticated event when authentication is successful', async () => {
        const driver = getMountedDriver({ component: Authentication, router });
        const pageObj = new AuthenticationPageObject(driver);
        await pageObj.setUserName('valid');
        await pageObj.setPassword('pass');
        await pageObj.clickLogin();
        await driver.nextRender();
        expect(driver.emitted().authenticated).toBeTruthy();
        expect(await pageObj.requiredFieldsValidationWarningExists()).toBeFalsy();
        expect(await pageObj.expiredCredentialsWarningExists()).toBeFalsy();
        expect(await pageObj.invalidCredentialsWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });
});
