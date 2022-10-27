import RequisitePlugin from '../plugins/RequisitePlugin';
import { mount } from '@vue/test-utils';
import router from '../router';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';
import SystemErrorAlertPageObject from '@requisite/page-objects/lib/components/SystemErrorAlert';
import VueWrapperDriver from '../../tests/unit/VueWrapperDriver';

describe('./components/SystemErrorAlert.vue', () => {

    function getDriver(propsData?: Record<string, unknown>): VueWrapperDriver {
        const wrapper = mount(
            SystemErrorAlert,
            { router, propsData, global: { plugins: [ RequisitePlugin ]} }
        );
        return new VueWrapperDriver(wrapper);
    }

    it('does NOT display the error message by default', async () => {
        const driver = getDriver();
        const pageObj = new SystemErrorAlertPageObject(driver);
        expect(await pageObj.systemErrorExists()).toBeFalsy();
    });

    it('does NOT display the error message if the display property is false', async () => {
        const driver = getDriver({ display: false });
        const pageObj = new SystemErrorAlertPageObject(driver);
        expect(await pageObj.systemErrorExists()).toBeFalsy();
    });

    it('displays the error message if the display property is true', async () => {
        const driver = getDriver({ display: true });
        const pageObj = new SystemErrorAlertPageObject(driver);
        expect(await pageObj.systemErrorExists()).toBeTruthy();
    });

});
