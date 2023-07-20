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
import Story from '@requisite/model/lib/story/Story';
import FeaturesDataModel from './FeaturesDataModel';
import User from '@requisite/model/lib/user/User';
import Feature from '@requisite/model/lib/product/Feature';
import ProductsDataModel from './ProductsDataModel';

const tableName = 'stories';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    featureId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB
    },
    title: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('title')
    },
    description: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('description')
    }
};

export default class StoriesDataModel extends Model implements Story {

    id: number;
    featureId: number;
    feature: Feature;
    title: string;
    description: string;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        feature: Association<StoriesDataModel, FeaturesDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        StoriesDataModel.init(columnMappings, { sequelize, tableName });
        StoriesDataModel.belongsTo(FeaturesDataModel, {
            as: 'feature',
            foreignKey: 'featureId'
        });
    }

    public static toDataModel(story: Story): StoriesDataModel {
        return {
            ...story,
            featureId: story.feature.id
        } as unknown as StoriesDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toStory(model: StoriesDataModel): Story {
        const story = model.toJSON ? model.toJSON() : model;
        delete story.featureId;
        delete story.data;
        delete story.createdAt;
        delete story.updatedAt;
        delete story.updatedBy;
        return story;
    }
}

enableDataModelLogging(StoriesDataModel);

enableFindIncludeOptions(StoriesDataModel, () => [
    {
        association: StoriesDataModel.associations.feature,
        include: [{
            association: FeaturesDataModel.associations.product,
            include: [{
                association: ProductsDataModel.associations.organization
            }]
        }]
    }
]);
enableCreateUpdateDataModelTransformation(StoriesDataModel, (data) => {
    return StoriesDataModel.toDataModel(data);
});
