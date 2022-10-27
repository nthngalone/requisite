/* eslint-disable @typescript-eslint/no-unused-vars */
import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';
import Membership from '@requisite/model/lib/user/Membership';
import { NotFoundError } from '../util/ApiErrors';
import { getLogger } from '../util/Logger';
import ProductsService from './ProductsService';
import ProductMembershipsDataModel from './sqlz/data-models/ProductMembershipsDataModel';
import ProductsDataModel from './sqlz/data-models/ProductsDataModel';
import { runWithSequelize } from './sqlz/SqlzUtils';

const logger = getLogger('services/ProductsServiceSqlzImpl');

export default class ProductsServiceSqlzImpl implements ProductsService {

    async listProducts(org: Organization): Promise<Product[]> {
        return (await runWithSequelize(async (sqlz) => {
            ProductsDataModel.initialize(sqlz);
            return ProductsDataModel.findAll({ where: { organizationId: org.id }});
        })).map(data => ProductsDataModel.toProduct(data));
    }
    async getProduct(id: number): Promise<Product> {
        const product = await runWithSequelize(async (sqlz) => {
            ProductsDataModel.initialize(sqlz);
            return ProductsDataModel.findByPk(id);
        });
        return product ? ProductsDataModel.toProduct(product) : null;
    }
    async createProduct(product: Product): Promise<Product> {
        return ProductsDataModel.toProduct(
            await runWithSequelize(async (sqlz) => {
                ProductsDataModel.initialize(sqlz);
                const { id } = await ProductsDataModel.create({ ...product });
                return ProductsDataModel.findByPk(id);
            })
        );
    }
    async updateProduct(product: Product): Promise<Product> {
        const [count] = await runWithSequelize(async (sqlz) => {
            ProductsDataModel.initialize(sqlz);
            const { id } = product;
            return ProductsDataModel.update(
                product,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return product;
    }
    async deleteProduct(product: Product): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = product;
            ProductsDataModel.initialize(sqlz);
            return ProductsDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }
    async listMemberships(product: Product): Promise<Membership<Product>[]> {
        return (await runWithSequelize(async (sqlz) => {
            ProductMembershipsDataModel.initialize(sqlz);
            return ProductMembershipsDataModel.findAll({
                where: { productId: product.id }
            });
        })).map(
            membership => ProductMembershipsDataModel.toProductMembership(membership)
        );
    }
    async addMembership(membership: Membership<Product>): Promise<Membership<Product>> {
        return ProductMembershipsDataModel.toProductMembership(
            await runWithSequelize(async (sqlz) => {
                ProductMembershipsDataModel.initialize(sqlz);
                const { id }
                    = await ProductMembershipsDataModel.create({ ...membership });
                return ProductMembershipsDataModel.findByPk(id);
            })
        );
    }
    async updateMembership(
        membership: Membership<Product>
    ): Promise<Membership<Product>> {
        const [count] = await runWithSequelize(async (sqlz) => {
            ProductMembershipsDataModel.initialize(sqlz);
            const { id } = membership;
            return ProductMembershipsDataModel.update(
                membership,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return membership;
    }
    async removeMembership(membership: Membership<Product>): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = membership;
            ProductMembershipsDataModel.initialize(sqlz);
            return ProductMembershipsDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }

}
