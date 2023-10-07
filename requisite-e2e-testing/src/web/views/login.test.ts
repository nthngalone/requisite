import puppeteer, { Page } from 'puppeteer';
import LoginPageObject from '@requisite/page-objects/lib/views/LoginPageObject';
import HomePageObject from '@requisite/page-objects/lib/views/HomePageObject';
import Driver from '@requisite/page-objects/lib/Driver';
import PuppeteerPageDriver from '../PuppeteerPageDriver';
import { createTestUser, afterAllDeleteCreatedUsers, executeTest } from '../../TestUtils';

const loginPageUrl = process.env.E2E_TESTS_REQUISITE_BASE_URL;

describe('Login', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('navigating to the site displays the Login page', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('login', page, async () => {

            await page.goto(loginPageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.assertNoAccessibilityErrors();

        });
    }, 10000);

    test('entering no user name displays a validation error', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('login', page, async () => {

            await page.goto(loginPageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login('', 'secret');
            expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();
            await pageObj.assertNoAccessibilityErrors();

        });
    }, 10000);

    test('entering no password displays a validation error', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('login', page, async () => {

            await page.goto(loginPageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login('user1', '');
            expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();
            await pageObj.assertNoAccessibilityErrors();

        });
    }, 10000);

    test('entering an invalid user name displays an invalid credentials error', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('login', page, async () => {
            const user = await createTestUser();
            const { userName, password } = user as never;
            await page.goto(loginPageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login(`invalid${userName}`, password);
            await page.screenshot({ path: './screenshots/invalid-error.png' });
            expect(await pageObj.invalidCredentialsWarningExists()).toBeTruthy();
            await pageObj.assertNoAccessibilityErrors();

        });
    }, 10000);

    test('entering an invalid password displays an invalid credentials error', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('login', page, async () => {
            const user = await createTestUser();
            const { userName, password } = user as never;
            await page.goto(loginPageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login(userName, `invalid${password}`);
            expect(await pageObj.invalidCredentialsWarningExists()).toBeTruthy();
            await pageObj.assertNoAccessibilityErrors();

        });
    }, 10000);

    test('successful login takes you to the home page', async () => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page: Page = await browser.newPage();
        await executeTest('login', page, async () => {
            const user = await createTestUser();
            const { userName, password } = user as never;
            await page.goto(loginPageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const loginPageObj: LoginPageObject = new LoginPageObject(driver);
            const homePageObj: HomePageObject = new HomePageObject(driver);
            await loginPageObj.waitForPageAvailability();
            await loginPageObj.login(userName, password);
            await homePageObj.waitForPageAvailability();
            expect(await homePageObj.getHeaderPageSubtitle()).toBe('Home');
            await homePageObj.assertNoAccessibilityErrors();

        });
    }, 10000);
});
