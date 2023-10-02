import { getHttpClient, returnData } from '../utils/HttpClient';
import type Organization from '@requisite/model/lib/org/Organization';
import type Product from '@requisite/model/lib/product/Product';

export default class ProductService {
    async getProducts(org: Organization):
        Promise<Product[]> {

        return getHttpClient().get(
            `/api/orgs/${org.id}/products`
        ).then(returnData<Product[]>());
    }

}
