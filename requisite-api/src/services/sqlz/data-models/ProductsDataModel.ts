import Organization from '@requisite/model/lib/org/Organization';
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
import User from '@requisite/model/lib/user/User';
import OrganizationsDataModel from './OrganizationsDataModel';

const tableName = 'products';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: {
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
    primaryContact: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('primaryContact')
    }
};

export default class ProductsDataModel extends Model implements Product {

    id: number;
    organizationId: number;
    organization?: Organization;
    name: string;
    description: string;
    primaryContact: User;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        organization: Association<ProductsDataModel, OrganizationsDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        ProductsDataModel.init(columnMappings, { sequelize, tableName });
        ProductsDataModel.belongsTo(OrganizationsDataModel, {
            as: 'organization',
            foreignKey: 'organizationId'
        });
    }

    public static toDataModel(product: Product): ProductsDataModel {
        return {
            ...product,
            organizationId: product.organization.id
        } as ProductsDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toProduct(model: ProductsDataModel): Product {
        const product = model.toJSON ? model.toJSON() as ProductsDataModel : model;
        delete product.organizationId;
        delete product.data;
        delete product.createdAt;
        delete product.updatedAt;
        delete product.updatedBy;
        return product;
    }
}

enableDataModelLogging(ProductsDataModel);

enableFindIncludeOptions(ProductsDataModel, () => [
    { association: ProductsDataModel.associations.organization }
]);
enableCreateUpdateDataModelTransformation(ProductsDataModel, (data) => {
    return ProductsDataModel.toDataModel(data);
});
