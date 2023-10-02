import type Membership from '@requisite/model/lib/user/Membership';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import {
    Sequelize,
    Model,
    DataTypes,
    Association,
} from 'sequelize';
import UsersDataModel from './UsersDataModel';
import type User from '@requisite/model/lib/user/User';
import type Product from '@requisite/model/lib/product/Product';
import ProductsDataModel from './ProductsDataModel';
import {
    enableCreateUpdateDataModelTransformation,
    enableDataModelLogging,
    enableFindIncludeOptions
} from '../SqlzUtils';

const tableName = 'productMemberships';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        enum: ProductRole
    }
};

export default class ProductMembershipsDataModel
    extends Model implements Membership<Product> {

    id: number;
    userId: number;
    user: UsersDataModel;
    productId: number;
    entity: ProductsDataModel;
    role: ProductRole;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        user: Association<ProductMembershipsDataModel, UsersDataModel>,
        entity: Association<ProductMembershipsDataModel, ProductsDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        ProductMembershipsDataModel.init(columnMappings, { sequelize, tableName });
        ProductMembershipsDataModel.belongsTo(UsersDataModel, {
            foreignKey: 'userId', // belongsTo - foreign key belongs to local table
            as: 'user'
        });
        ProductMembershipsDataModel.belongsTo(ProductsDataModel, {
            foreignKey: 'productId', // belongsTo - foreign key belongs to local table
            as: 'entity'
        });
    }

    public static toDataModel(
        productMembership: Membership<Product>
    ): ProductMembershipsDataModel {
        return {
            ...productMembership,
            productId: productMembership.entity.id,
            userId: productMembership.user.id
        } as unknown as ProductMembershipsDataModel;
    }

    public static toProductMembership(
        model: ProductMembershipsDataModel
    ): Membership<Product> {
        const productMembership = model.toJSON ? model.toJSON() : model;
        (productMembership as Membership<Product>).user
            = UsersDataModel.toUser(productMembership.user);
        (productMembership as Membership<Product>).entity
            = ProductsDataModel.toProduct(productMembership.entity);
        delete productMembership.productId;
        delete productMembership.userId;
        delete productMembership.createdAt;
        delete productMembership.updatedAt;
        delete productMembership.updatedBy;
        return productMembership;
    }

}

enableDataModelLogging(ProductMembershipsDataModel);

enableFindIncludeOptions(ProductMembershipsDataModel, () => [
    {
        association: ProductMembershipsDataModel.associations.entity,
        include: [{
            association: ProductsDataModel.associations.organization
        }]
    },
    { association: ProductMembershipsDataModel.associations.user }
]);

enableCreateUpdateDataModelTransformation(ProductMembershipsDataModel, (data) => {
    return ProductMembershipsDataModel.toDataModel(data);
});
