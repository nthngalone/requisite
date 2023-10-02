import type Organization from '@requisite/model/lib/org/Organization';
import type Product from '@requisite/model/lib/product/Product';
import type Membership from '@requisite/model/lib/user/Membership';

export default interface ProductsService {
    listProducts(org: Organization): Promise<Product[]>;
    getProduct(id: number): Promise<Product>;
    createProduct(product: Product): Promise<Product>;
    updateProduct(product: Product): Promise<Product>;
    deleteProduct(product: Product): Promise<void>;
    listMemberships(product: Product): Promise<Membership<Product>[]>;
    getMembership(id: number): Promise<Membership<Product>>;
    addMembership(membership: Membership<Product>): Promise<Membership<Product>>;
    updateMembership(membership: Membership<Product>): Promise<Membership<Product>>;
    removeMembership(membership: Membership<Product>): Promise<void>;
}
