import BasePageObject from '../BasePageObject';
import { alertMessageSelector, alertSelector, buttonSelector, checkboxInputSelector, passwordInputSelector, textboxInputSelector } from '../utils/selectorUtil';

const selectorRootElement = '.requisite-registration';
const selectorUserNameInput = textboxInputSelector(selectorRootElement, 'user-name');
const selectorEmailAddressInput = textboxInputSelector(selectorRootElement, 'email-address');
const selectorFirstNameInput = textboxInputSelector(selectorRootElement, 'first-name');
const selectorLastNameInput  = textboxInputSelector(selectorRootElement, 'last-name');
const selectorPasswordInput = passwordInputSelector(selectorRootElement, 'password');
const selectorPasswordConfirmationInput = passwordInputSelector(selectorRootElement, 'password-confirmation');
const selectorTermsAgreementCheckbox = checkboxInputSelector(selectorRootElement, 'terms-agreement');
const selectorRegisterButton = buttonSelector(selectorRootElement, 'register');
const selectorValidationWarnings = alertSelector(selectorRootElement, 'validation-warnings');
const selectorUserNameValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'user-name-warning');
const selectorEmailAddressValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'email-address-warning');
const selectorFirstNameValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'first-name-warning');
const selectorLastNameValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'last-name-warning');
const selectorPasswordValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'password-warning');
const selectorPasswordConfirmationValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'password-confirmation-warning');
const selectorTermsAgreementValidationWarning = alertMessageSelector(selectorRootElement, 'validation-warnings', 'terms-agreement-warning');
const selectorUserNameConflictWarning = alertSelector(selectorRootElement, 'user-name-conflict-warning');
const selectorEmailAddressConflictWarning = alertSelector(selectorRootElement, 'email-address-conflict-warning');

export default class RegistrationPageObject extends BasePageObject {

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
    async setEmailAddress(emailAddress: string): Promise<void> {
        const input = await this.driver.getElementBySelector(
            selectorEmailAddressInput,
            this.parentSelector
        );
        await input.setValue(emailAddress);
    }
    async getEmailAddress(): Promise<string> {
        const input = await this.driver.getElementBySelector(
            selectorEmailAddressInput,
            this.parentSelector
        );
        return input.getValue();
    }
    async setFirstName(firstName: string): Promise<void> {
        const input = await this.driver.getElementBySelector(
            selectorFirstNameInput,
            this.parentSelector
        );
        await input.setValue(firstName);
    }
    async getFirstName(): Promise<string> {
        const input = await this.driver.getElementBySelector(
            selectorFirstNameInput,
            this.parentSelector
        );
        return input.getValue();
    }
    async setLastName(lastName: string): Promise<void> {
        const input = await this.driver.getElementBySelector(
            selectorLastNameInput,
            this.parentSelector
        );
        await input.setValue(lastName);
    }
    async getLastName(): Promise<string> {
        const input = await this.driver.getElementBySelector(
            selectorLastNameInput,
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
    async setPasswordConfirmation(password: string): Promise<void> {
        const input = await this.driver.getElementBySelector(
            selectorPasswordConfirmationInput,
            this.parentSelector
        );
        input.setValue(password);
    }
    async getPasswordConfirmation(): Promise<string> {
        const input = await this.driver.getElementBySelector(
            selectorPasswordConfirmationInput,
            this.parentSelector
        );
        return input.getValue();
    }
    async checkTermsAgreement(): Promise<void> {
        const check = await this.driver.getElementBySelector(
            selectorTermsAgreementCheckbox,
            this.parentSelector
        );
        await check.check();
    }
    async getTermsAgreement(): Promise<boolean> {
        const check = await this.driver.getElementBySelector(
            selectorTermsAgreementCheckbox,
            this.parentSelector
        );
        return (await check.getValue()) === 'true';
    }
    async clickRegister(): Promise<void> {
        const button = await this.driver.getElementBySelector(
            selectorRegisterButton,
            this.parentSelector
        );
        await button.click();
    }
    async waitForValidationWarnings(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(selectorValidationWarnings, timeoutMs);
    }
    async userNameValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorUserNameValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async emailAddressValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorEmailAddressValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async firstNameValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorFirstNameValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async lastNameValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorLastNameValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async passwordValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorPasswordValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async passwordConfirmationValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorPasswordConfirmationValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async termsAgreementValidationWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorTermsAgreementValidationWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async userNameConflictWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorUserNameConflictWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async waitForUserNameConflictWarning(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(
            selectorUserNameConflictWarning,
            timeoutMs
        );
    }
    async emailAddressConflictWarningExists(): Promise<boolean> {
        const msg = await this.driver.getElementBySelector(
            selectorEmailAddressConflictWarning,
            this.parentSelector
        );
        return msg.exists();
    }
    async waitForEmailAddressConflictWarning(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(
            selectorEmailAddressConflictWarning,
            timeoutMs
        );
    }

}
