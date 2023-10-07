import BasePageObject from '../BasePageObject';
import { avatarSelector, dropDownMenuLinkSelector, dropDownMenuSelector, dropDownMenuTextSelector, navBarSelector, navElementSelector } from '../utils/selectorUtil';

const selectorRootElement = navBarSelector('', 'requisite-header-navigation');
const selectorTitle = navElementSelector(selectorRootElement, 'title');
const selectorSubtitle =  navElementSelector(selectorRootElement, 'subtitle');
const selectorAvatarMenu = dropDownMenuSelector(selectorRootElement, 'avatar-menu');
const selectorAvatarMenuAvatar = avatarSelector(selectorAvatarMenu, 'avatar-menu-avatar');
const selectorMenuItemUserName = dropDownMenuTextSelector(selectorAvatarMenu, 'user-name');
const selectorMenuItemProfileLink = dropDownMenuLinkSelector(selectorAvatarMenu, 'profile-link');
const selectorMenuItemLogoutLink = dropDownMenuLinkSelector(selectorAvatarMenu, 'signout-link');

export default class HeaderNavigationPageObject extends BasePageObject {

    getRootSelector(): string {
        return selectorRootElement;
    }
    async getPageTitle(): Promise<string> {
        const element = await this.driver.getElementBySelector(
            selectorTitle,
            this.parentSelector
        );
        return element.getInnerText();
    }
    async getPageSubtitle(): Promise<string> {
        const element = await this.driver.getElementBySelector(
            selectorSubtitle,
            this.parentSelector
        );
        return element.getInnerText();
    }
    async getUserName(): Promise<string> {
        const element = await this.driver.getElementBySelector(
            selectorMenuItemUserName,
            this.parentSelector
        );
        return element.getInnerText();
    }
    async waitForAvatarMenuToBeAvailable(timeoutMs: number): Promise<void> {
        return this.waitForElementAvailability(selectorAvatarMenu, timeoutMs);
    }
    async avatarMenuExists(): Promise<boolean> {
        const element = await this.driver.getElementBySelector(
            selectorAvatarMenu,
            this.parentSelector
        );
        return element.exists();
    }
    async getAvatarMenuAvatar(): Promise<string> {
        const element = await this.driver.getElementBySelector(
            selectorAvatarMenuAvatar,
            this.parentSelector
        );
        return element.getInnerText();
    }
    async openAvatarMenu(): Promise<void> {
        const element = await this.driver.getElementBySelector(
            selectorAvatarMenuAvatar,
            this.parentSelector
        );
        await element.click();
        await this.waitForElementAvailability(selectorAvatarMenu);
    }
    async clickMenuItemProfile(): Promise<void> {
        const link = await this.driver.getElementBySelector(
            selectorMenuItemProfileLink,
            this.parentSelector
        );
        await link.click();
    }
    async clickMenuItemLogout(): Promise<void> {
        const link = await this.driver.getElementBySelector(
            selectorMenuItemLogoutLink,
            this.parentSelector
        );
        await link.click();
    }

}
