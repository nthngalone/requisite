import RequisitePlugin from '../plugins/RequisitePlugin';
import { mount } from '@vue/test-utils';
import router from '../router';
import Home from '../views/Home.vue';
import HomePageObject from '@requisite/page-objects/lib/views/HomePageObject';
import VueWrapperDriver from '../../tests/unit/VueWrapperDriver';
import User from '@requisite/model/lib/user/User';

jest.mock('../services/SecurityService', () => {
    return class {
        async getUser():
            Promise<User> {
            throw new Error('unsupported operation');
        }
    };
});

describe('./views/Home.vue', () => {

    function getDriver(): VueWrapperDriver {
        const wrapper = mount(Home, { router, global: { plugins: [ RequisitePlugin ]} });
        return new VueWrapperDriver(wrapper);
    }

    it('displays a system error alert when a system error event is received', async () => {
        // override console.error to keep output clean
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const driver = getDriver();
        jest.spyOn(driver.router(), 'push');
        const pageObj = new HomePageObject(driver);
        await driver.nextRender();
        expect(pageObj.systemErrorExists()).toBeTruthy();
    });
});
