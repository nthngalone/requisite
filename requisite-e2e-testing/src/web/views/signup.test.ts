import puppeteer, { Page } from 'puppeteer';
import LoginPageObject from '@requisite/page-objects/lib/views/LoginPageObject';
import SignUpPageObject from '@requisite/page-objects/lib/views/SignUpPageObject';
import HomePageObject from '@requisite/page-objects/lib/views/HomePageObject';
import Driver from '@requisite/page-objects/lib/Driver';
import PuppeteerPageDriver from '../PuppeteerPageDriver';
import { createTestUser, testUserNamePrefix, afterAllDeleteCreatedUsers } from '../../TestUtils';

const homePageUrl = process.env.E2E_TESTS_REQUISITE_BASE_URL;

const executeTest = async (
    page: Page,
    test: () => Promise<void>
) => {
    const ts = new Date().getTime();
    let result = '';
    try {
        await test();
        result = 'success';
    } catch(err) {
        result = 'error';
        throw err;
    } finally {
        const path = `screenshots/signup-${ts}-${result}.png`;
        await page.screenshot({ path });
        console.log(`Created screenshot at ${path}`);
        await page.browser().close();
    }
};

describe('SignUp', () => {
    afterAll(afterAllDeleteCreatedUsers);
    async function navigateToSignUp(page: Page): Promise<SignUpPageObject> {
        const driver: Driver = new PuppeteerPageDriver(page);
        const loginPageObj: LoginPageObject = new LoginPageObject(driver);
        const signUpPageObj: SignUpPageObject = new SignUpPageObject(driver);
        await page.goto(homePageUrl);
        await loginPageObj.waitForPageAvailability();
        await loginPageObj.clickSignUpLink();
        await signUpPageObj.waitForPageAvailability();
        return signUpPageObj;
    }
    test('navigating to the sign up page displays the Signup page', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
            const pageObj: SignUpPageObject = await navigateToSignUp(page);
            expect(await pageObj.getHeaderPageSubtitle()).toBe('SignUp');
        });
    });
    test('displays a conflict warning if trying to register an existing user name', async () => {
        const user = await createTestUser();
        const { userName } = user;
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
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
        });
    });
    test('displays a conflict warning if trying to register an existing email address', async () => {
        const user = await createTestUser();
        const { emailAddress } = user;
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
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
        });
    });
    test('registering with proper data creates the user and takes them to the home page', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
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
        });
    });


});
