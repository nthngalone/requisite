import RequisitePlugin from '../plugins/RequisitePlugin';
import { mount } from '@vue/test-utils';
import router from '../router';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import HeaderNavigationPageObject from '@requisite/page-objects/lib/components/HeaderNavigationPageObject';
import VueWrapperDriver from '../../tests/unit/VueWrapperDriver';
import SecurityService from '../services/SecurityService';
import SecurityContext from '@requisite/model/lib/user/SecurityContext';

jest.mock('../services/SecurityService', () => {
    return class {

        async getContext(): Promise<SecurityContext> {
            return Promise.resolve({
                user: {
                    userName: 'user',
                    name: {
                        firstName: 'First',
                        lastName: 'Last'
                    }
                }
            } as unknown as SecurityContext);
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async logout(): Promise<void> { }
    };
});

describe('./components/HeaderNavigation.vue', () => {

    function getDriver(propsData?: Record<string, unknown>): VueWrapperDriver {
        const wrapper = mount(
            HeaderNavigation,
            { router, propsData, global: { plugins: [ RequisitePlugin ]} }
        );
        return new VueWrapperDriver(wrapper, router);
    }

    it('displays the current route name as the subtitle', async () => {
        const driver = getDriver();
        const pageObj = new HeaderNavigationPageObject(driver);
        if (router.currentRoute.value.path !== '/home') {
            await router.push('/home');
        }
        expect(await pageObj.getPageSubtitle()).toBe('Home');
    });

    it('does not display the user avatar menu if the secured property is false', async () => {
        const driver = getDriver({ secured: false });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(await pageObj.avatarMenuExists()).toBeFalsy();
    });

    it('does not display the user avatar menu if the secured property is true but a user does not exist', async () => {
        jest.spyOn(SecurityService.prototype, 'getContext').mockImplementation((): Promise<SecurityContext> => {
            return Promise.resolve({
                user: {}
            } as unknown as SecurityContext);
        });
        const driver = getDriver({ secured: true });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(await pageObj.avatarMenuExists()).toBeFalsy();
    });

    it('displays the user avatar menu if the secured property is true and a user exists', async () => {
        const driver = getDriver({ secured: true });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(await pageObj.avatarMenuExists()).toBeTruthy();
        expect(await pageObj.getAvatarMenuAvatar()).toBe('FL');
    });

    it('displays the user name in the avatar menu if the secured property is true and a user exists', async () => {
        const driver = getDriver({ secured: true });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(await pageObj.avatarMenuExists()).toBeTruthy();
        expect(await pageObj.getUserName()).toBe('First Last');
    });

    it('navigates the secured user to the profile view if the profile menu item is clicked', async () => {
        const driver = getDriver({ secured: true });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        await pageObj.clickAvatarMenu();
        await pageObj.clickMenuItemProfile();
        expect(driver.router().push).toHaveBeenCalledWith(expect.objectContaining({ name: 'Profile' }));
    });

    it('logs out the secured user if the log out menu item is clicked', async () => {
        const driver = getDriver({ secured: true });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        await pageObj.clickAvatarMenu();
        await pageObj.clickMenuItemLogout();
        expect(driver.router().push).toHaveBeenCalledWith(expect.objectContaining({ name: 'Login' }));
    });

    it('emits a system-error event if retrieving the user causes an unexpected error', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(SecurityService.prototype, 'getContext').mockImplementation((): Promise<SecurityContext> => {
            return Promise.reject(new Error('Ack! Get context failed!'));
        });
        const driver = getDriver({ secured: true });
        await driver.nextRender();
        await driver.nextRender();
        expect(driver.emitted()['system-error']).toBeTruthy();
    });

    it('emits a system-error event if executing a logout causes an unexpected error', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(SecurityService.prototype, 'getContext').mockImplementation((): Promise<SecurityContext> => {
            return Promise.resolve({
                user: {
                    userName: 'user',
                    name: {
                        firstName: 'First',
                        lastName: 'Last'
                    }
                }
            } as unknown as SecurityContext);
        });
        jest.spyOn(SecurityService.prototype, 'logout').mockImplementation((): Promise<void> => {
            return Promise.reject(new Error('Ack! Logout failed!'));
        });
        const driver = getDriver({ secured: true });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        await pageObj.clickMenuItemLogout();
        await driver.nextRender();
        expect(driver.emitted()['system-error']).toBeTruthy();
    });

});
