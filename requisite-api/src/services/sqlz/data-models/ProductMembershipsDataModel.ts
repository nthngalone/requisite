import Membership, { ProductRole } from '@requisite/model/lib/user/Membership';
import {
    Sequelize,
    Model,
    DataTypes,
    Association,
} from 'sequelize';
import UsersDataModel from './UsersDataModel';
import User from '@requisite/model/lib/user/User';
import Product from '@requisite/model/lib/product/Product';
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
        prodMembership: Membership<Product>
    ): ProductMembershipsDataModel {
        return {
            ...prodMembership,
            productId: prodMembership.entity.id,
            userId: prodMembership.user.id
        } as unknown as ProductMembershipsDataModel;
    }

    public static toProductMembership(
        dataModel: ProductMembershipsDataModel
    ): Membership<Product> {
        const prodMembership = dataModel.toJSON() as ProductMembershipsDataModel;
        (prodMembership as Membership<Product>).user
            = UsersDataModel.toUser(prodMembership.user);
        (prodMembership as Membership<Product>).entity
            = ProductsDataModel.toProduct(prodMembership.entity);
        delete prodMembership.productId;
        delete prodMembership.userId;
        delete prodMembership.createdAt;
        delete prodMembership.updatedAt;
        delete prodMembership.updatedBy;
        return prodMembership;
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
