import BasePageObject from '../BasePageObject';
import { alertSelector } from '../utils/selectorUtil';

const selectorRootElement = '.requisite-system-error';
const selectorSystemError = alertSelector(selectorRootElement, 'system-error');

export default class SystemAlertPageObject extends BasePageObject {

    getRootSelector(): string {
        return selectorRootElement;
    }
    async systemErrorExists(): Promise<boolean> {
        const element = await this.driver.getElementBySelector(
            selectorSystemError,
            this.parentSelector
        );
        return element.exists();
    }
    async waitForSystemError(timeoutMs?: number): Promise<void> {
        return this.waitForElementAvailability(selectorSystemError, timeoutMs);
    }

}
