import BaseViewPageObject from './BaseViewPageObject';

const selectorRootElement = '.requisite-home';

export default class HomePageObject extends BaseViewPageObject {

    getRootSelector(): string {
        return selectorRootElement;
    }
}
