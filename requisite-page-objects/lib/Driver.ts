import axe from 'axe-core';

export default interface Driver {

    getRootElement(): Promise<HTMLElement>;
    getElementBySelector(
        selector: string,
        parentSelector?: string
    ): Promise<QueryResponse>;

    getElementsBySelector(
        selector: string,
        parentSelector: string
    ): Promise<QueryAllResponse>;

    searchForAccessibilityErrors(options: axe.RunOptions): Promise<axe.AxeResults>;

// not sure why this is being flagged as a linting error but nowhere else,
// disabling for now
// eslint-disable-next-line semi
}

export interface QueryResponse {
    exists(): Promise<boolean>;
    click(): Promise<void>;
    check(): Promise<void>;
    setValue(value: string): Promise<void>;
    getValue(): Promise<string>;
    getInnerHTML(): Promise<string>;
    getInnerText(): Promise<string>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QueryAllResponse {

}
