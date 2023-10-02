import RequisitePlugin from '../plugins/RequisitePlugin';
import { mount } from '@vue/test-utils';
import router from '../router';
import SignUp from '../views/SignUp.vue';
import SignUpPageObject from '@requisite/page-objects/lib/views/SignUpPageObject';
import VueWrapperDriver from '../../tests/unit/VueWrapperDriver';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';
import AuthenticationResponse from '@requisite/model/lib/user/AuthenticationResponse';
import RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';

jest.mock('../services/SecurityService', () => {
    return class {
        async login():
            Promise<AuthenticationResponse> {
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
                default:
                    return Promise.reject(new Error('error'));
            }
        }
    };
});

describe('./views/SignUp.vue', () => {

    function getDriver(): VueWrapperDriver {
        const wrapper = mount(
            SignUp,
            { router, global: { plugins: [ RequisitePlugin ]} }
        );
        return new VueWrapperDriver(wrapper, router);
    }

    it('routes to /home when a registered event is received', async () => {
        const driver = getDriver();
        jest.spyOn(driver.router(), 'push');
        const pageObj = new SignUpPageObject(driver);
        await pageObj.register({
            emailAddress: 'email@address.com',
            firstName: 'first',
            lastName: 'last',
            password: 'pass',
            passwordConfirmation: 'pass',
            termsAgreement: true,
            userName: 'valid'
        });
        await driver.nextRender();
        expect(driver.router().push).toHaveBeenCalledWith('/home');
    });

    it('displays a system error alert when a system error event is received', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getDriver();
        jest.spyOn(driver.router(), 'push');
        const pageObj = new SignUpPageObject(driver);
        await pageObj.register({
            emailAddress: 'email@address.com',
            firstName: 'first',
            lastName: 'last',
            password: 'pass',
            passwordConfirmation: 'pass',
            termsAgreement: true,
            userName: 'error'
        });
        await driver.nextRender();
        expect(driver.router().push).not.toHaveBeenCalled();
        expect(pageObj.systemErrorExists()).toBeTruthy();
    });
});
