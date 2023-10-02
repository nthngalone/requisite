import type FeaturesService from './FeaturesService';
import { runWithSequelize } from './sqlz/SqlzUtils';
import type Product from '@requisite/model/lib/product/Product';
import { getLogger } from '../util/Logger';
import type Feature from '@requisite/model/lib/product/Feature';
import FeaturesDataModel from './sqlz/data-models/FeaturesDataModel';
import { NotFoundError } from '../util/ApiErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/FeaturesServiceSqlzImpl');

export default class FeaturesServiceSqlzImpl implements FeaturesService {
    async listFeatures(product: Product): Promise<Feature[]> {
        return (await runWithSequelize(async (sqlz) => {
            FeaturesDataModel.initialize(sqlz);
            return FeaturesDataModel.findAll({ where: { productId: product.id }});
        })).map(data => FeaturesDataModel.toFeature(data));
    }
    async getFeature(id: number): Promise<Feature> {
        const feature = await runWithSequelize(async (sqlz) => {
            FeaturesDataModel.initialize(sqlz);
            return FeaturesDataModel.findByPk(id);
        });
        return feature ? FeaturesDataModel.toFeature(feature) : null;
    }
    async createFeature(feature: Feature): Promise<Feature> {
        return FeaturesDataModel.toFeature(
            await runWithSequelize(async (sqlz) => {
                FeaturesDataModel.initialize(sqlz);
                const { id } = await FeaturesDataModel.create({ ...feature });
                return FeaturesDataModel.findByPk(id);
            })
        );
    }
    async updateFeature(feature: Feature): Promise<Feature> {
        const [count] = await runWithSequelize(async (sqlz) => {
            FeaturesDataModel.initialize(sqlz);
            const { id } = feature;
            return FeaturesDataModel.update(
                feature,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return feature;
    }
    async deleteFeature(feature: Feature): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = feature;
            FeaturesDataModel.initialize(sqlz);
            return FeaturesDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }

}
