import {
    enableCreateUpdateDataModelTransformation,
    enableDataModelLogging,
    enableFindIncludeOptions,
    getDataGettersAndSetters
} from '../SqlzUtils';
import {
    Sequelize,
    Model,
    DataTypes,
    Association
} from 'sequelize';
import type Product from '@requisite/model/lib/product/Product';
import type User from '@requisite/model/lib/user/User';
import ProductsDataModel from './ProductsDataModel';
import type Feature from '@requisite/model/lib/product/Feature';

const tableName = 'features';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB
    },
    name: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('name')
    },
    description: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('description')
    }
};

export default class FeaturesDataModel extends Model implements Feature {

    id: number;
    productId: number;
    product?: Product;
    name: string;
    description: string;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        product: Association<FeaturesDataModel, ProductsDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        FeaturesDataModel.init(columnMappings, { sequelize, tableName });
        FeaturesDataModel.belongsTo(ProductsDataModel, {
            as: 'product',
            foreignKey: 'productId'
        });
    }

    public static toDataModel(feature: Feature): FeaturesDataModel {
        return {
            ...feature,
            productId: feature.product.id
        } as unknown as FeaturesDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toFeature(model: FeaturesDataModel): Feature {
        const feature = model.toJSON ? model.toJSON() : model;
        delete feature.productId;
        delete feature.data;
        delete feature.createdAt;
        delete feature.updatedAt;
        delete feature.updatedBy;
        return feature;
    }
}

enableDataModelLogging(FeaturesDataModel);

enableFindIncludeOptions(FeaturesDataModel, () => [{
    association: FeaturesDataModel.associations.product,
    include: [{ association: ProductsDataModel.associations.organization }]
}]);
enableCreateUpdateDataModelTransformation(FeaturesDataModel, (data) => {
    return FeaturesDataModel.toDataModel(data);
});
