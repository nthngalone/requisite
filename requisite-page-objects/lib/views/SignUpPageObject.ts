import RegistrationPageObject from '../components/RegistrationPageObject';
import BaseViewPageObject from './BaseViewPageObject';
import HomePageObject from './HomePageObject';

const selectorRootElement = '.requisite-sign-up';

interface RegistrationRequest {
    userName?: string;
    password?: string;
    passwordConfirmation?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
    termsAgreement?: boolean;
}

export default class SignUpPageObject extends BaseViewPageObject {

    getRootSelector(): string {
        return selectorRootElement;
    }

    async register(regRequest: RegistrationRequest): Promise<void> {
        const registration = this.getRegistrationPageObject();
        await registration.setUserName(regRequest.userName || '');
        await registration.setPassword(regRequest.password || '');
        await registration.setPasswordConfirmation(regRequest.passwordConfirmation || '');
        await registration.setFirstName(regRequest.firstName || '');
        await registration.setLastName(regRequest.lastName || '');
        await registration.setEmailAddress(regRequest.emailAddress || '');
        if (regRequest.termsAgreement) {
            await registration.checkTermsAgreement();
        }

        await registration.clickRegister();
    }

    async userNameValidationWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.userNameValidationWarningExists();
    }

    async firstNameValidationWarning(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.firstNameValidationWarningExists();
    }

    async lastNameValidationWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.lastNameValidationWarningExists();
    }

    async emailAddressValidationWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.emailAddressValidationWarningExists();
    }

    async passwordValidationWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.passwordValidationWarningExists();
    }

    async passwordConfirmationValidationWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.passwordConfirmationValidationWarningExists();
    }

    async termsAgreementValidationWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForValidationWarnings();
        return registration.termsAgreementValidationWarningExists();
    }

    async userNameConflictWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForUserNameConflictWarning();
        return registration.userNameConflictWarningExists();
    }

    async emailAddressConflictWarningExists(): Promise<boolean> {
        const registration = this.getRegistrationPageObject();
        await registration.waitForEmailAddressConflictWarning();
        return registration.emailAddressConflictWarningExists();
    }

    async waitForHomePage(): Promise<void> {
        const homePage = new HomePageObject(this.driver);
        await homePage.waitForPageAvailability();
    }

    private getRegistrationPageObject(): RegistrationPageObject {
        return new RegistrationPageObject(
            this.driver,
            selectorRootElement
        );
    }
}
