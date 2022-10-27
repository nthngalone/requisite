import BasePageObject from '../BasePageObject';
import { textboxInputSelector, buttonSelector, passwordInputSelector, alertSelector } from '../utils/selectorUtil';

const selectorRootElement = '.requisite-authentication';
const selectorUserNameInput = textboxInputSelector(selectorRootElement, 'user-name');
const selectorPasswordInput = passwordInputSelector(selectorRootElement, 'password');
const selectorLoginButton = buttonSelector(selectorRootElement, 'login');
const selectorRequiredFieldsValidationWarning = alertSelector(selectorRootElement, 'required-fields-warning');
const selectorInvalidCredentialsWarning = alertSelector(selectorRootElement, 'invalid-credentials-warning');
const selectorExpiredCredentialsWarning = alertSelector(selectorRootElement, 'expired-credentials-warning');

export default class AuthenticationPageObject extends BasePageObject {

    getRootSelector(): string {
        return selectorRootElement;
    }
    async setUserName(userName: string): Promise<void> {
        const input = await this.driver.getElementBySelector(
            selectorUserNameInput,
            this.parentSelector
        );
        await input.setValue(userName);
    }
    async getUserName(): Promise<string> {
        const input = await this.driver.getElementBySelector(
            selectorUserNameInput,
            this.parentSelector
        );
        return input.getValue();
    }
    async setPassword(password: string): Promise<void> {
        const input = await this.driver.getElementBySelector(
            selectorPasswordInput,
            this.parentSelector
        );
        await input.setValue(password);
    }
    async getPassword(): Promise<string> {
        const input = await this.driver.getElementBySelector(
            selectorPasswordInput,
            this.parentSelector
        );
        return input.getValue();
    }
    async clickLogin(): Promise<void> {
        const button = await this.driver.getElementBySelector(
            selectorLoginButton,
            this.parentSelector
        );
        await button.click();
    }
    async requiredFieldsValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorRequiredFieldsValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async waitForRequiredFieldsValidationWarning(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(
            selectorRequiredFieldsValidationWarning,
            timeoutMs
        );
    }
    async invalidCredentialsWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorInvalidCredentialsWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async waitForInvalidCredentialsWarning(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(
            selectorInvalidCredentialsWarning,
            timeoutMs
        );
    }
    async expiredCredentialsWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorExpiredCredentialsWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async waitForExpiredCredentialsWarning(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(
            selectorExpiredCredentialsWarning,
            timeoutMs
        );
    }

}
