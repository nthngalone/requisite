import router from '../router';
import SystemErrorAlert from '../components/SystemErrorAlert.vue';
import SystemErrorAlertPageObject from '@requisite/page-objects/lib/components/SystemErrorAlert';
import { getMountedDriver } from '../../tests/unit/VueWrapperDriver';
import '../../tests/unit/matchMediaShim';
import '../../tests/unit/consoleOverrides';

describe('./components/SystemErrorAlert.vue', () => {

    it('does NOT display the error message by default', async () => {
        const driver = getMountedDriver({
            component: SystemErrorAlert,
            router,
        });
        const pageObj = new SystemErrorAlertPageObject(driver);
        expect(await pageObj.systemErrorExists()).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('does NOT display the error message if the display property is false', async () => {
        const driver = getMountedDriver({
            component: SystemErrorAlert,
            props: { display: false },
            router,
        });
        const pageObj = new SystemErrorAlertPageObject(driver);
        expect(await pageObj.systemErrorExists()).toBeFalsy();
        await pageObj.assertNoAccessibilityErrors();
    });

    it('displays the error message if the display property is true', async () => {
        const driver = getMountedDriver({
            component: SystemErrorAlert,
            props: { display: true },
            router,
        });
        const pageObj = new SystemErrorAlertPageObject(driver);
        expect(await pageObj.systemErrorExists()).toBeTruthy();
        await pageObj.assertNoAccessibilityErrors();
    });

});
