import puppeteer, { Page } from 'puppeteer';
import LoginPageObject from '@requisite/page-objects/lib/views/LoginPageObject';
import SignUpPageObject from '@requisite/page-objects/lib/views/SignUpPageObject';
import HomePageObject from '@requisite/page-objects/lib/views/HomePageObject';
import Driver from '@requisite/page-objects/lib/Driver';
import PuppeteerPageDriver from '../PuppeteerPageDriver';
import { createTestUser, testUserNamePrefix, afterAllDeleteCreatedUsers, executeTest } from '../../TestUtils';

const loginPageUrl = process.env.E2E_TESTS_REQUISITE_BASE_URL;

describe('SignUp', () => {
    afterAll(afterAllDeleteCreatedUsers);
    async function navigateToSignUp(page: Page): Promise<SignUpPageObject> {
        const driver: Driver = new PuppeteerPageDriver(page);
        const loginPageObj: LoginPageObject = new LoginPageObject(driver);
        const signUpPageObj: SignUpPageObject = new SignUpPageObject(driver);
        await page.goto(loginPageUrl);
        await loginPageObj.waitForPageAvailability();
        await loginPageObj.clickSignUpLink();
        await signUpPageObj.waitForPageAvailability();
        return signUpPageObj;
    }
    test('navigating to the sign up page displays the Signup page', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('signup', page, async () => {
            const pageObj: SignUpPageObject = await navigateToSignUp(page);
            expect(await pageObj.getHeaderPageSubtitle()).toBe('SignUp');
            await pageObj.assertNoAccessibilityErrors();
        });
    }, 10000);
    test('displays a conflict warning if trying to register an existing user name', async () => {
        const user = await createTestUser();
        const { userName } = user;
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('signup', page, async () => {
            const pageObj: SignUpPageObject = await navigateToSignUp(page);
            await pageObj.register({
                userName,
                password: 'p@$$w0rd',
                passwordConfirmation: 'p@$$w0rd',
                firstName: 'Registration',
                lastName: 'Test',
                emailAddress: 'registrationUserNameConflict@requisite.io',
                termsAgreement: true
            });
            expect(await pageObj.userNameConflictWarningExists());
            await pageObj.assertNoAccessibilityErrors();
        });
    }, 10000);
    test('displays a conflict warning if trying to register an existing email address', async () => {
        const user = await createTestUser();
        const { emailAddress } = user;
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('signup', page, async () => {
            const pageObj: SignUpPageObject = await navigateToSignUp(page);
            await pageObj.register({
                userName: `${testUserNamePrefix}EmailConflict`,
                password: 'p@$$w0rd',
                passwordConfirmation: 'p@$$w0rd',
                firstName: 'Registration',
                lastName: 'Test',
                emailAddress,
                termsAgreement: true
            });
            expect(await pageObj.emailAddressConflictWarningExists());
            await pageObj.assertNoAccessibilityErrors();
        });
    }, 10000);
    test('registering with proper data creates the user and takes them to the home page', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('signup', page, async () => {
            const pageObj: SignUpPageObject = await navigateToSignUp(page);
            await pageObj.register({
                userName: `${testUserNamePrefix}RegistrationSuccess`,
                password: 'p@$$w0rd',
                passwordConfirmation: 'p@$$w0rd',
                firstName: 'Registration',
                lastName: 'Test',
                emailAddress: 'registrationSuccess@requisite.io',
                termsAgreement: true
            });
            const homePageObj: HomePageObject = new HomePageObject(pageObj.driver);
            await homePageObj.waitForPageAvailability();
            expect(await homePageObj.getHeaderPageSubtitle()).toBe('Home');
            await pageObj.assertNoAccessibilityErrors();
        });
    }, 10000);


});
