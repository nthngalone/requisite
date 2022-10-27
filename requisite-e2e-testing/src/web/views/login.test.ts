import puppeteer, { Page } from 'puppeteer';
import LoginPageObject from '@requisite/page-objects/lib/views/LoginPageObject';
import HomePageObject from '@requisite/page-objects/lib/views/HomePageObject';
import Driver from '@requisite/page-objects/lib/Driver';
import PuppeteerPageDriver from '../PuppeteerPageDriver';
import { createTestUser, afterAllDeleteCreatedUsers } from '../../TestUtils';

const homePageUrl = process.env.E2E_TESTS_REQUISITE_BASE_URL;

const executeTest = async (
    page: Page,
    test: () => Promise<void>
) => {
    try {
        await test();
        const path = `screenshots/login-${new Date().getTime()}-success.png`;
        await page.screenshot({ path });
    } catch(err) {
        const path = `screenshots/login-${new Date().getTime()}-error.png`;
        await page.screenshot({ path });
        throw err;
    } finally {
        await page.browser().close();
    }
};

describe('Login', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('navigating to the site displays the Login page', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {

            await page.goto(homePageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();

        });
    });

    test('entering no user name displays a validation error', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {

            await page.goto(homePageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login('', 'secret');
            expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();

        });
    });

    test('entering no password displays a validation error', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {

            await page.goto(homePageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login('user1', '');
            expect(await pageObj.requiredFieldsValidationWarningExists()).toBeTruthy();

        });
    });

    test('entering an invalid user name displays an invalid credentials error', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
            const user = await createTestUser();
            const { userName, password } = user as never;
            await page.goto(homePageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login(`invalid${userName}`, password);
            expect(await pageObj.invalidCredentialsWarningExists()).toBeTruthy();

        });
    });

    test('entering an invalid password displays an invalid credentials error', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
            const user = await createTestUser();
            const { userName, password } = user as never;
            await page.goto(homePageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const pageObj: LoginPageObject = new LoginPageObject(driver);
            await pageObj.waitForPageAvailability();
            await pageObj.login(userName, `invalid${password}`);
            expect(await pageObj.invalidCredentialsWarningExists()).toBeTruthy();

        });
    });

    test('successful login takes you to the home page', async () => {
        const browser = await puppeteer.launch();
        const page: Page = await browser.newPage();
        await executeTest(page, async () => {
            const user = await createTestUser();
            const { userName, password } = user as never;
            await page.goto(homePageUrl);

            const driver: Driver = new PuppeteerPageDriver(page);
            const loginPageObj: LoginPageObject = new LoginPageObject(driver);
            const homePageObj: HomePageObject = new HomePageObject(driver);
            await loginPageObj.waitForPageAvailability();
            await loginPageObj.login(userName, password);
            await homePageObj.waitForPageAvailability();
            expect(await homePageObj.getHeaderPageTitle()).toBe('Home');

        });
    });
});
