import AuthenticationPageObject from '../components/AuthenticationPageObject';
import { linkSelector } from '../utils/selectorUtil';
import BaseViewPageObject from './BaseViewPageObject';
import HomePageObject from './HomePageObject';

const selectorRootElement = '.requisite-login';
const selectorSignUpLink = linkSelector(selectorRootElement, 'sign-up');

export default class LoginPageObject extends BaseViewPageObject {

    getRootSelector(): string {
        return selectorRootElement;
    }

    async login(userName: string, password: string): Promise<void> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.setUserName(userName);
        await authentication.setPassword(password);
        await authentication.clickLogin();
    }

    async waitForRequiredFieldsValidationWarning(): Promise<void> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.waitForRequiredFieldsValidationWarning();
    }

    async requiredFieldsValidationWarningExists(): Promise<boolean> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.waitForRequiredFieldsValidationWarning();
        return authentication.requiredFieldsValidationWarningExists();
    }

    async waitForInvalidCredentialsWarning(): Promise<void> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.waitForInvalidCredentialsWarning();
    }

    async invalidCredentialsWarningExists(): Promise<boolean> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.waitForInvalidCredentialsWarning();
        return authentication.invalidCredentialsWarningExists();
    }

    async waitForExpiredCredentialsWarning(): Promise<void> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.waitForExpiredCredentialsWarning();
    }

    async expiredCredentialsWarningExists(): Promise<boolean> {
        const authentication = this.getAuthenticationPageObject();
        await authentication.waitForExpiredCredentialsWarning();
        return authentication.expiredCredentialsWarningExists();
    }

    async clickSignUpLink(): Promise<void> {
        const link = await this.driver.getElementBySelector(
            selectorSignUpLink,
            this.parentSelector
        );
        await link.click();

    }

    async waitForHomePage(): Promise<void> {
        const homePage = new HomePageObject(this.driver);
        await homePage.waitForPageAvailability();
    }

    private getAuthenticationPageObject(): AuthenticationPageObject {
        return new AuthenticationPageObject(
            this.driver,
            selectorRootElement
        );
    }
}
