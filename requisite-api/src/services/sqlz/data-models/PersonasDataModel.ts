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
import Persona from '@requisite/model/lib/product/Persona';
import ProductsDataModel from './ProductsDataModel';
import User from '@requisite/model/lib/user/User';

const tableName = 'personas';

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

export default class PersonasDataModel extends Model implements Persona {

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
        product: Association<PersonasDataModel, ProductsDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        PersonasDataModel.init(columnMappings, { sequelize, tableName });
        PersonasDataModel.belongsTo(ProductsDataModel, {
            as: 'product',
            foreignKey: 'productId'
        });
    }

    public static toDataModel(constituent: Persona): PersonasDataModel {
        return {
            ...constituent,
            productId: constituent.product.id
        } as unknown as PersonasDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toPersona(model: PersonasDataModel): Persona {
        const persona = model.toJSON ? model.toJSON() : model;
        delete persona.productId;
        delete persona.data;
        delete persona.createdAt;
        delete persona.updatedAt;
        delete persona.updatedBy;
        return persona;
    }
}

enableDataModelLogging(PersonasDataModel);

enableFindIncludeOptions(PersonasDataModel, () => [{
    association: PersonasDataModel.associations.product,
    include: [{ association: ProductsDataModel.associations.organization }]
}]);
enableCreateUpdateDataModelTransformation(PersonasDataModel, (data) => {
    return PersonasDataModel.toDataModel(data);
});
