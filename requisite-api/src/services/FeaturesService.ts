import Feature from '@requisite/model/lib/product/Feature';
import Product from '@requisite/model/lib/product/Product';

export default interface FeaturesService {
    listFeatures(product: Product): Promise<Feature[]>;
    getFeature(id: number): Promise<Feature>;
    createFeature(feature: Feature): Promise<Feature>;
    updateFeature(feature: Feature): Promise<Feature>;
    deleteFeature(feature: Feature): Promise<void>;
}
