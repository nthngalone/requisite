import Driver, { QueryResponse, QueryAllResponse } from '@requisite/page-objects/lib/Driver';
import { VueWrapper, DOMWrapper } from '@vue/test-utils';
import { Router, RouteRecord } from 'vue-router';

export default class VueWrapperDriver implements Driver {

    private wrapper: VueWrapper<any>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(wrapper: VueWrapper<any>) {
        this.wrapper = wrapper;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async nextRender(): Promise<void> {
        await this.wrapper.vm.$nextTick();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data(): Record<string, any> {
        return this.wrapper.vm;
    }

    emitted(): { [name: string]: unknown[][] } {
        return this.wrapper.emitted() as { [name: string]: unknown[][] };
    }

    html(): string {
        return this.wrapper.html();
    }

    router(): Router {
        return this.wrapper.vm.$router;
    }

    route(): RouteRecord {
        return this.wrapper.vm.$route;
    }

    async getElementBySelector(selector: string): Promise<QueryResponse> {
        return new VueWrapperQueryResponse(this.wrapper.find(selector));
    }

    async getElementsBySelector(selector: string): Promise<QueryAllResponse> {
        return new VueWrapperQueryAllResponse(this.wrapper.findAll(selector));
    }

}

class VueWrapperQueryResponse implements QueryResponse {

    private wrapper: DOMWrapper<Element>;

    constructor(wrapper: DOMWrapper<Element>) {
        this.wrapper = wrapper;
    }

    async exists(): Promise<boolean> {
        return this.wrapper.exists();
    }

    async getInnerHTML(): Promise<string> {
        return this.wrapper.html();
    }

    async getInnerText(): Promise<string> {
        return this.wrapper.text();
    }

    async click(): Promise<void> {
        await this.wrapper.trigger('click');
    }

    async check(): Promise<void> {
        await this.wrapper.setValue();
    }

    async setValue(value: string): Promise<void> {
        await this.wrapper.setValue(value);
    }

    async getValue(): Promise<string> {
        return this.wrapper.attributes().value;
    }

}

class VueWrapperQueryAllResponse implements VueWrapperQueryAllResponse {
    private wrapperArray: DOMWrapper<Element>[];

    constructor(wrapperArray: DOMWrapper<Element>[]) {
        this.wrapperArray = wrapperArray;
    }
}
