import BasePageObject from '../BasePageObject';
import HeaderNavigationPageObject from '../components/HeaderNavigationPageObject';
import SystemErrorAlertPageObject from '../components/SystemErrorAlert';

export default abstract class BaseViewPageObject extends BasePageObject {

    abstract getRootSelector(): string;

    async getHeaderPageTitle(): Promise<string> {
        const headerNav = this.getHeaderNavigationPageObject();
        return headerNav.getPageTitle();
    }
    async getHeaderPageSubtitle(): Promise<string> {
        const headerNav = this.getHeaderNavigationPageObject();
        return headerNav.getPageSubtitle();
    }
    async getHeaderUserName(): Promise<string> {
        const headerNav = this.getHeaderNavigationPageObject();
        return headerNav.getUserName();
    }
    async getHeaderAvatarMenuAvatar(): Promise<string> {
        const headerNav = this.getHeaderNavigationPageObject();
        return headerNav.getAvatarMenuAvatar();
    }
    async clickHeaderMenuItemProfile(): Promise<void> {
        const headerNav = this.getHeaderNavigationPageObject();
        await headerNav.clickMenuItemProfile();
    }
    async clickHeaderMenuItemLogout(): Promise<void> {
        const headerNav = this.getHeaderNavigationPageObject();
        await headerNav.clickMenuItemLogout();
    }
    async systemErrorExists(): Promise<boolean> {
        const systemErrorAlert = this.getSystemErrorAlertPageObject();
        return systemErrorAlert.systemErrorExists();
    }
    async waitForSystemError(timeoutMs?: number): Promise<void> {
        const systemErrorAlert = this.getSystemErrorAlertPageObject();
        return systemErrorAlert.waitForSystemError(timeoutMs);
    }

    private getHeaderNavigationPageObject(): HeaderNavigationPageObject {
        return new HeaderNavigationPageObject(
            this.driver,
            this.getRootSelector()
        );
    }

    private getSystemErrorAlertPageObject(): SystemErrorAlertPageObject {
        return new SystemErrorAlertPageObject(
            this.driver,
            this.getRootSelector()
        );
    }
}
