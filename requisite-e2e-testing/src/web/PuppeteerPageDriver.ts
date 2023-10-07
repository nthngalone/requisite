import Driver, { QueryResponse, QueryAllResponse } from '@requisite/page-objects/lib/Driver';
import { RunOptions, AxeResults } from 'axe-core';
import { Page, ElementHandle } from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

export default class PuppeteerPageDriver implements Driver {

    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    searchForAccessibilityErrors(options: RunOptions): Promise<AxeResults> {
        return new AxePuppeteer(this.page).options(options).analyze();
    }
    getRootElement(): Promise<HTMLElement> {
        return this.page.evaluate(() => document.body);
    }
    async getElementBySelector(
        selector: string,
        parentSelector: string
    ): Promise<QueryResponse> {
        selector = parentSelector ? `${parentSelector} ${selector}` : selector;
        return new PuppeteerPageQueryResponse(
            this.page,
            await this.page.$(selector),
            selector
        );
    }
    getElementsBySelector(
    /*selector: string, parentSelector: string*/
    ): Promise<QueryAllResponse> {
        throw new Error('Method not implemented.');
    }

}

class PuppeteerPageQueryResponse implements QueryResponse {

    private page: Page;
    private element: ElementHandle<Element>;
    private selector: string;

    constructor(page: Page, element: ElementHandle<Element>, selector: string) {
        this.page = page;
        this.element = element;
        this.selector = selector;
    }
    async exists(): Promise<boolean> {
        return this.page.evaluate(
            element => (element !== null && element !== undefined),
            this.element
        );
    }
    async getInnerHTML(): Promise<string> {
        return this.page.evaluate(element => element.innerHTML, this.element);
    }
    async getInnerText(): Promise<string> {
        return this.page.evaluate(
            element => (element as HTMLElement).innerText, this.element
        );
    }
    async click(): Promise<void> {
        await this.element.evaluate(b => {
            return (b as HTMLElement).click();
        });
    }
    async check(): Promise<void> {
        await this.element.evaluate(b => {
            return (b as HTMLElement).click();
        });
    }
    async setValue(value: string): Promise<void> {
        await this.element.type(value, { delay: 50 });
    }
    async getValue(): Promise<string> {
        return this.page.evaluate(
            element => (element as HTMLInputElement).value, this.element
        );
    }

}

// class PuppeteerPageQueryAllResponse implements QueryAllResponse {

// }
