import RequisitePlugin from '../plugins/RequisitePlugin';
import { mount } from '@vue/test-utils';
import router from '../router';
import Registration from '../components/Registration.vue';
import RegistrationPageObject from '@requisite/page-objects/lib/components/RegistrationPageObject';
import VueWrapperDriver from '../../tests/unit/VueWrapperDriver';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';
import AuthenticationResponse from '@requisite/model/lib/user/AuthenticationResponse';
import RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';

jest.mock('../services/SecurityService', () => {
    class ConflictError extends Error {
        data: { conflictReason: string };
        constructor(conflictReason: string) {
            super('conflict');
            this.data = { conflictReason };
        }
    }
    return class {
        async login(): Promise<AuthenticationResponse> {
            throw new Error('unsupported operation');
        }

        async register(regRequest: RegistrationRequest):
            Promise<RegistrationResponse> {
            switch (regRequest.userName) {
                case 'valid':
                    return Promise.resolve({
                        message: 'Registered',
                        token: 'valid-token'
                    });
                case 'user-name-conflict':
                    return Promise.reject(new ConflictError('userName'));
                case 'email-address-conflict':
                    return Promise.reject(new ConflictError('emailAddress'));
                case 'unknown':
                    return Promise.resolve({
                        message: 'Something Unknown Happened',
                        token: ''
                    });
                default:
                    return Promise.reject(new Error('error'));
            }
        }
    };
});

describe('./components/Registration.vue', () => {

    function getDriver(): VueWrapperDriver {
        const wrapper = mount(
            Registration,
            { router, global: { plugins: [ RequisitePlugin ]} }
        );
        return new VueWrapperDriver(wrapper, router);
    }

    it('displays no warnings or errors on mount', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        expect(await pageObj.emailAddressConflictWarningExists()).toBeFalsy();
        expect(await pageObj.emailAddressValidationWarningExists()).toBeFalsy();
        expect(await pageObj.firstNameValidationWarningExists()).toBeFalsy();
        expect(await pageObj.lastNameValidationWarningExists()).toBeFalsy();
        expect(await pageObj.passwordConfirmationValidationWarningExists()).toBeFalsy();
        expect(await pageObj.passwordValidationWarningExists()).toBeFalsy();
        expect(await pageObj.termsAgreementValidationWarningExists()).toBeFalsy();
        expect(await pageObj.userNameConflictWarningExists()).toBeFalsy();
        expect(await pageObj.userNameValidationWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
    });

    it('captures user input for the registration fields', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setUserName('user');
        await pageObj.setPassword('pass');
        await pageObj.setPasswordConfirmation('pass');
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.setFirstName('first');
        await pageObj.setLastName('last');
        await pageObj.checkTermsAgreement();
        const data = driver.data();
        expect(data.request.userName).toMatch('user');
        expect(data.request.password).toMatch('pass');
        expect(data.request.passwordConfirmation).toMatch('pass');
        expect(data.request.emailAddress).toMatch('email@address.com');
        expect(data.request.name.firstName).toMatch('first');
        expect(data.request.name.lastName).toMatch('last');
        expect(data.request.termsAgreement).toBeTruthy();
    });

    it('displays a warning message when register is clicked if the required fields are not provided', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.clickRegister();
        await pageObj.waitForValidationWarnings(4000);
        expect(await pageObj.emailAddressValidationWarningExists()).toBeTruthy();
        expect(await pageObj.firstNameValidationWarningExists()).toBeTruthy();
        expect(await pageObj.lastNameValidationWarningExists()).toBeTruthy();
        expect(await pageObj.passwordConfirmationValidationWarningExists()).toBeTruthy();
        expect(await pageObj.passwordValidationWarningExists()).toBeTruthy();
        expect(await pageObj.termsAgreementValidationWarningExists()).toBeTruthy();
        expect(await pageObj.userNameValidationWarningExists()).toBeTruthy();
    });

    it('displays a warning message when the email address is not a valid format', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setEmailAddress('email');
        await pageObj.clickRegister();
        await pageObj.waitForValidationWarnings(4000);
        expect(await pageObj.emailAddressValidationWarningExists()).toBeTruthy();
    });

    it('does not display a warning message when the email address is a valid format', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.clickRegister();
        await pageObj.waitForValidationWarnings(4000);
        expect(await pageObj.emailAddressValidationWarningExists()).toBeFalsy();
    });

    it('displays a warning message when the password and confirmation do not match', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setPassword('password');
        await pageObj.setPasswordConfirmation('password-doesnt-match');
        await pageObj.clickRegister();
        await pageObj.waitForValidationWarnings(4000);
        expect(await pageObj.passwordConfirmationValidationWarningExists()).toBeTruthy();
    });

    it('does not display a warning message when the password and confirmation do match', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setPassword('password-matches');
        await pageObj.setPasswordConfirmation('password-matches');
        await pageObj.clickRegister();
        await pageObj.waitForValidationWarnings(4000);
        expect(await pageObj.passwordConfirmationValidationWarningExists()).toBeFalsy();
    });

    it('displays a warning message when the user name is already registered', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setUserName('user-name-conflict');
        await pageObj.setPassword('pass');
        await pageObj.setPasswordConfirmation('pass');
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.setFirstName('first');
        await pageObj.setLastName('last');
        await pageObj.checkTermsAgreement();
        await pageObj.clickRegister();
        await pageObj.waitForUserNameConflictWarning(4000);
        expect(await pageObj.userNameConflictWarningExists()).toBeTruthy();
    });

    it('displays a warning message when the email address is already registered', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setUserName('email-address-conflict');
        await pageObj.setPassword('pass');
        await pageObj.setPasswordConfirmation('pass');
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.setFirstName('first');
        await pageObj.setLastName('last');
        await pageObj.checkTermsAgreement();
        await pageObj.clickRegister();
        await pageObj.waitForEmailAddressConflictWarning(4000);
        expect(await pageObj.emailAddressConflictWarningExists()).toBeTruthy();
    });

    it('emits a system error when an unrecognized response is received', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setUserName('unknown');
        await pageObj.setPassword('pass');
        await pageObj.setPasswordConfirmation('pass');
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.setFirstName('first');
        await pageObj.setLastName('last');
        await pageObj.checkTermsAgreement();
        await pageObj.clickRegister();
        await driver.nextRender();
        expect(driver.emitted()['system-error']).toBeTruthy();
    });

    it('emits a system error when the server fails', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setUserName('error');
        await pageObj.setPassword('pass');
        await pageObj.setPasswordConfirmation('pass');
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.setFirstName('first');
        await pageObj.setLastName('last');
        await pageObj.checkTermsAgreement();
        await pageObj.clickRegister();
        await driver.nextRender();
        expect(driver.emitted()['system-error']).toBeTruthy();
    });

    it('emits a registered event when registration is successful', async () => {
        const driver = getDriver();
        const pageObj = new RegistrationPageObject(driver);
        await pageObj.setUserName('valid');
        await pageObj.setPassword('pass');
        await pageObj.setPasswordConfirmation('pass');
        await pageObj.setEmailAddress('email@address.com');
        await pageObj.setFirstName('first');
        await pageObj.setLastName('last');
        await pageObj.checkTermsAgreement();
        await pageObj.clickRegister();
        await driver.nextRender();
        expect(driver.emitted().registered).toBeTruthy();
        expect(await pageObj.userNameConflictWarningExists()).toBeFalsy();
        expect(await pageObj.emailAddressConflictWarningExists()).toBeFalsy();
        expect(driver.emitted()['system-error']).toBeFalsy();
    });

});
