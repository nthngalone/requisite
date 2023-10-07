import router from '../router';
import Home from '../views/Home.vue';
import HomePageObject from '@requisite/page-objects/lib/views/HomePageObject';
import { getMountedDriver } from '../../tests/unit/VueWrapperDriver';
import type User from '@requisite/model/lib/user/User';
import '../../tests/unit/matchMediaShim';
import '../../tests/unit/consoleOverrides';

jest.mock('../services/SecurityService', () => {
    return class {
        async getUser():
            Promise<User> {
            throw new Error('unsupported operation');
        }
    };
});

describe('./views/Home.vue', () => {

    it('displays a system error alert when a system error event is received', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getMountedDriver({
            component: Home,
            router,
        });
        jest.spyOn(driver.router(), 'push');
        const pageObj = new HomePageObject(driver);
        await driver.nextRender();
        expect(pageObj.systemErrorExists()).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
    });
});
