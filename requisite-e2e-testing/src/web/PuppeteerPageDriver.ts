import Driver, { QueryResponse, QueryAllResponse } from '@requisite/page-objects/lib/Driver';
import { Page, ElementHandle } from 'puppeteer';

export default class PuppeteerPageDriver implements Driver {

    page: Page;

    constructor(page: Page) {
        this.page = page;
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
        return this.page.evaluate(element => element.innerText, this.element);
    }
    async click(): Promise<void> {
        await this.element.click();
    }
    async check(): Promise<void> {
        await this.element.click();
    }
    async setValue(value: string): Promise<void> {
        await this.element.type(value);
    }
    async getValue(): Promise<string> {
        return this.page.evaluate(element => element.value, this.element);
    }

}

// class PuppeteerPageQueryAllResponse implements QueryAllResponse {

// }
