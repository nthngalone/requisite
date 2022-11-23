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
import Product from '@requisite/model/lib/product/Product';
import Constituent from '@requisite/model/lib/product/Constituent';
import ProductsDataModel from './ProductsDataModel';
import User from '@requisite/model/lib/user/User';

const tableName = 'productConstituents';

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
    },
    avatar: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('avatar')
    }
};

export default class ProductConstituentsDataModel extends Model implements Constituent {

    id: number;
    productId: number;
    product: Product;
    name: string;
    description: string;
    avatar: string;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        product: Association<ProductConstituentsDataModel, ProductsDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        ProductConstituentsDataModel.init(columnMappings, { sequelize, tableName });
        ProductConstituentsDataModel.belongsTo(ProductsDataModel, {
            as: 'product',
            foreignKey: 'productId'
        });
    }

    public static toDataModel(constituent: Constituent): ProductConstituentsDataModel {
        return {
            ...constituent,
            productId: constituent.product.id
        } as unknown as ProductConstituentsDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toConstituent(model: ProductConstituentsDataModel): Constituent {
        const constituent = model.toJSON ? model.toJSON() : model;
        delete constituent.productId;
        delete constituent.data;
        delete constituent.createdAt;
        delete constituent.updatedAt;
        delete constituent.updatedBy;
        return constituent;
    }
}

enableDataModelLogging(ProductConstituentsDataModel);

enableFindIncludeOptions(ProductConstituentsDataModel, () => [{
    association: ProductConstituentsDataModel.associations.product,
    include: [{ association: ProductsDataModel.associations.organization }]
}]);
enableCreateUpdateDataModelTransformation(ProductConstituentsDataModel, (data) => {
    return ProductConstituentsDataModel.toDataModel(data);
});
