import BasePageObject from '../BasePageObject';
import { navElementLinkSelector, navElementSelector, navElementTextSelector } from '../utils/selectorUtil';

const selectorRootElement = 'requisite-header-navigation';
const selectorTitle = navElementSelector(selectorRootElement, 'title');
const selectorSubtitle =  navElementSelector(selectorRootElement, 'subtitle');
const selectorAvatarMenu = navElementSelector(selectorRootElement, 'avatar-menu');
const selectorAvatarMenuAvatar = navElementSelector(selectorRootElement, 'avatar-menu-avatar');
const selectorMenuItemUserName = navElementTextSelector(selectorRootElement, 'avatar-menu-option-user-name');
const selectorMenuItemProfileLink = navElementLinkSelector(selectorRootElement, 'avatar-menu-option-profile-link');
const selectorMenuItemLogoutLink = navElementLinkSelector(selectorRootElement, 'avatar-menu-option-signout-link');

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
    async clickAvatarMenu(): Promise<void> {
        const element = await this.driver.getElementBySelector(
            selectorAvatarMenuAvatar,
            this.parentSelector
        );
        await element.click();
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
