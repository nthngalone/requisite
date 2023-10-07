import router from '../router';
import HeaderNavigation from '../components/HeaderNavigation.vue';
import HeaderNavigationPageObject from '@requisite/page-objects/lib/components/HeaderNavigationPageObject';
import { getMountedDriver } from '../../tests/unit/VueWrapperDriver';
import SecurityService from '../services/SecurityService';
import SecurityContext from '@requisite/model/lib/user/SecurityContext';
import '../../tests/unit/matchMediaShim';
import '../../tests/unit/consoleOverrides';

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

    it('displays the current route name as the subtitle', async () => {
        const driver = getMountedDriver({
            component: HeaderNavigation,
            router
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        if (router.currentRoute.value.path !== '/home') {
            await router.push('/home');
        }
        expect(await pageObj.getPageSubtitle()).toBe('Home');
        await pageObj.assertNoAccessibilityErrors();
    });

    it('does not display the user avatar menu if the secured property is false', async () => {
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: false },
            router,
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(await pageObj.avatarMenuExists()).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('does not display the user avatar menu if the secured property is true but a user does not exist', async () => {
        jest.spyOn(SecurityService.prototype, 'getContext').mockImplementation((): Promise<SecurityContext> => {
            return Promise.resolve({
                user: {}
            } as unknown as SecurityContext);
        });
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(await pageObj.avatarMenuExists()).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays the user avatar menu if the secured property is true and a user exists', async () => {
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        await pageObj.waitForAvatarMenuToBeAvailable(4000);
        expect(await pageObj.avatarMenuExists()).toBeTruthy();
        expect(await pageObj.getAvatarMenuAvatar()).toBe('FL');
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays the user name in the avatar menu if the secured property is true and a user exists', async () => {
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        await pageObj.waitForAvatarMenuToBeAvailable(4000);
        await pageObj.openAvatarMenu();
        expect(await pageObj.getUserName()).toBe('First Last');
        await pageObj.assertNoAccessibilityErrors();
    });

    it('navigates the secured user to the profile view if the profile menu item is clicked', async () => {
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new HeaderNavigationPageObject(driver);
        await pageObj.waitForAvatarMenuToBeAvailable(4000);
        await pageObj.openAvatarMenu();
        await pageObj.clickMenuItemProfile();
        expect(driver.router().push).toHaveBeenCalledWith(expect.objectContaining({ name: 'Profile' }));
        await pageObj.assertNoAccessibilityErrors();
    });

    it('logs out the secured user if the log out menu item is clicked', async () => {
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new HeaderNavigationPageObject(driver);
        await pageObj.waitForAvatarMenuToBeAvailable(4000);
        await pageObj.openAvatarMenu();
        await pageObj.clickMenuItemLogout();
        expect(driver.router().push).toHaveBeenCalledWith(expect.objectContaining({ name: 'Login' }));
        await pageObj.assertNoAccessibilityErrors();
    });

    it('emits a system-error event if retrieving the user causes an unexpected error', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(SecurityService.prototype, 'getContext').mockImplementation((): Promise<SecurityContext> => {
            return Promise.reject(new Error('Ack! Get context failed!'));
        });
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        await driver.nextRender();
        await driver.nextRender();
        expect(driver.emitted()['system-error']).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
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
        const driver = getMountedDriver({
            component: HeaderNavigation,
            props: { secured: true },
            router,
        });
        const pageObj = new HeaderNavigationPageObject(driver);
        await pageObj.waitForAvatarMenuToBeAvailable(4000);
        await pageObj.openAvatarMenu();
        await pageObj.clickMenuItemLogout();
        await driver.nextRender();
        expect(driver.emitted()['system-error']).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
    });

});
