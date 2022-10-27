import Driver from './Driver';

export default abstract class BasePageObject {

    driver: Driver;
    parentSelector?: string;

    constructor(driver: Driver, parentSelector?: string) {
        this.driver = driver;
        this.parentSelector = parentSelector;
    }

    async waitForPageAvailability(timeoutMs = 10000): Promise<void> {
        return this.waitForElementAvailability(this.getRootSelector(), timeoutMs);
    }

    async waitForElementAvailability(selector: string, timeoutMs = 10000): Promise<void> {
        const intervalTime = 500;
        let timeWaited = 0;
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const element = await this.driver.getElementBySelector(
                        selector,
                        this.parentSelector
                    );
                    const elementExists = await element.exists();
                    if (elementExists) {
                        clearInterval(intervalId);
                        resolve();
                    } else {
                        timeWaited += intervalTime;
                        if (timeWaited >= timeoutMs) {
                            clearInterval(intervalId);
                            reject(`Timeout [${timeoutMs}] exceeded waiting for availability of [${selector}]`);
                        }
                    }
                } catch(error) {
                    reject(error);
                }
            }, intervalTime);
        });
    }

    abstract getRootSelector(): string;
}
