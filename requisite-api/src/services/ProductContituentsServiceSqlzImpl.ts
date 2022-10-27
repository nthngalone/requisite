import ProductConstituentsDataModel from './sqlz/data-models/ProductConstituentsDataModel';
import { runWithSequelize } from './sqlz/SqlzUtils';
import Product from '@requisite/model/lib/product/Product';
import { getLogger } from '../util/Logger';
import ProductConstituentsService from './ProductConstituentsService';
import Constituent from '@requisite/model/lib/product/Constituent';
import { NotFoundError } from '../util/ApiErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/ProductConstituentsServiceSqlzImpl');

export default class ProductConstituentsServiceSqlzImpl
implements ProductConstituentsService {
    async listConstituents(product: Product): Promise<Constituent[]> {
        return (await runWithSequelize(async (sqlz) => {
            ProductConstituentsDataModel.initialize(sqlz);
            return ProductConstituentsDataModel.findAll({
                where: { productId: product.id }
            });
        })).map(data => ProductConstituentsDataModel.toConstituent(data));
    }
    async getConstituent(id: number): Promise<Constituent> {
        const constituent = await runWithSequelize(async (sqlz) => {
            ProductConstituentsDataModel.initialize(sqlz);
            return ProductConstituentsDataModel.findByPk(id);
        });
        return constituent
            ? ProductConstituentsDataModel.toConstituent(constituent)
            : null;
    }
    async createConstituent(constituent: Constituent): Promise<Constituent> {
        return ProductConstituentsDataModel.toConstituent(
            await runWithSequelize(async (sqlz) => {
                ProductConstituentsDataModel.initialize(sqlz);
                const { id } =
                    await ProductConstituentsDataModel.create({ ...constituent });
                return ProductConstituentsDataModel.findByPk(id);
            })
        );
    }
    async updateConstituent(constituent: Constituent): Promise<Constituent> {
        const [count] = await runWithSequelize(async (sqlz) => {
            ProductConstituentsDataModel.initialize(sqlz);
            const { id } = constituent;
            return ProductConstituentsDataModel.update(
                constituent,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return constituent;
    }
    async deleteConstituent(constituent: Constituent): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = constituent;
            ProductConstituentsDataModel.initialize(sqlz);
            return ProductConstituentsDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }

}
