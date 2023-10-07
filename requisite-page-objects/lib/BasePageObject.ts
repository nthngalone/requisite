import type Driver from './Driver';
import a11yExceptions from './a11yExceptions';

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
        const intervalTime = 250;
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

    async assertNoAccessibilityErrors() {
        const results = await this.driver.searchForAccessibilityErrors({
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'section508', 'best-practice'] // 'wcag2a', 'wcag2aa',
            }
        });
        if (results.violations.length > 0) {
            const violations: Record<string, string>[] = [];
            results.violations.filter(({ impact }) => {
                return ['critical', 'serious'].includes(impact || '');
            }).forEach((v) => {
                v.nodes.forEach(n => {
                    const record = {
                        id: v.id,
                        tags: v.tags.join(),
                        impact: n.impact || '',
                        summary: n.failureSummary || '',
                        help: v.help,
                        helpUrl: v.helpUrl,
                        html: n.html
                    };
                    // Check to see if this violation is an exception that we are
                    // currently deferring on.  See comments in the a11yExceptions
                    // for reasons on why violations are deferred.
                    const isException = a11yExceptions.find(e => {
                        return e.id === record.id
                            && e.summary === record.summary
                            && e.html === record.html;
                    });
                    if (!isException) {
                        violations.push(record);
                    }
                });
            });
            if (violations.length > 0) {
                throw new Error(`${violations.length} accessibility violations(s) found.\n${JSON.stringify(violations, null, 4)}`);
            }
        }
    }

    abstract getRootSelector(): string;
}
