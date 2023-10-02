import type Organization from '@requisite/model/lib/org/Organization';
import type Product from '@requisite/model/lib/product/Product';
import ProductService from '../services/ProductService';
import UserService from '../services/UserService';

export default class ProductSelectorStateManager {

    private userService: UserService = new UserService();
    private productService: ProductService = new ProductService();

    public orgs: Organization[] = [];
    public products: Product[] = [];
    public systemError = false;

    async getOrgs(): Promise<void> {
        this.orgs = await this.userService.getOrgs();
    }

    async getProducts(org: Organization): Promise<void> {
        this.products = await this.productService.getProducts(org);
    }

    reset(): void {
        this.orgs = [];
        this.products = [];
        this.systemError = false;
    }
}
