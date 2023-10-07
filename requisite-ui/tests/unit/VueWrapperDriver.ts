import Driver, { QueryResponse, QueryAllResponse } from '@requisite/page-objects/lib/Driver';
import { mount, VueWrapper, DOMWrapper } from '@vue/test-utils';
import axe, { RunOptions, AxeResults } from 'axe-core';
import { Router } from 'vue-router';
import RequisitePlugin from '../../src/plugins/RequisitePlugin';

export interface VueWrapperDriverOptions {
    component: unknown,
    router: Router,
    props?: Record<string, unknown>,
    debug?: boolean
}

export function getMountedDriver(
    options: VueWrapperDriverOptions
): VueWrapperDriver {
    const wrapper = mount(
        options.component,
        {
            router: options.router,
            propsData: options.props,
            attachTo: document.body,
            global: { plugins: [ RequisitePlugin ] }
        }
    );
    return new VueWrapperDriver(wrapper, options.router, options.debug);
}

export default class VueWrapperDriver implements Driver {

    private wrapper: VueWrapper<unknown>;
    private vueRouter: Router;
    private debug: boolean;

    constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wrapper: VueWrapper<any>,
        router: Router,
        debug?: boolean
    ) {
        this.wrapper = wrapper;
        this.vueRouter = router;
        this.debug = debug || false;
    }

    async searchForAccessibilityErrors(options: RunOptions): Promise<AxeResults> {
        const element = await this.getRootElement();
        return axe.run(
            element as unknown as axe.ElementContext,
            options
        );
    }

    getRootElement(): Promise<HTMLElement> {
        return Promise.resolve(this.wrapper.element as HTMLElement);
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
        return this.vueRouter;
    }

    // route(): RouteRecord {
    //     return this.vueRouter.currentRoute;
    // }

    async getElementBySelector(selector: string): Promise<QueryResponse> {
        const queryResponse = this.wrapper.find(selector);
        if (this.debug) {
            console.log(
                `query response for selector:\n\n${selector}\n\n`,
                queryResponse.exists() ? queryResponse.element : 'not found'
            );
        }
        return new VueWrapperQueryResponse(queryResponse);
    }

    async getElementsBySelector(selector: string): Promise<QueryAllResponse> {
        const queryResponse = this.wrapper.findAll(selector);
        if (this.debug) {
            console.log(`query response for selector:\n\n${selector}\n\n`, queryResponse);
        }
        return new VueWrapperQueryAllResponse(queryResponse);
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
