import type StoryRevision from '@requisite/model/lib/story/StoryRevision';
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
import type User from '@requisite/model/lib/user/User';
import ModificationState from '@requisite/model/lib/common/ModificationState';
import type AcceptanceCriteria from '@requisite/model/lib/story/AcceptanceCriteria';
import type Story from '@requisite/model/lib/story/Story';
import StoriesDataModel from './StoriesDataModel';
import FeaturesDataModel from './FeaturesDataModel';
import ProductsDataModel from './ProductsDataModel';
import ReleaseState from '@requisite/model/lib/common/ReleaseState';
import StoryPersonasDataModel from './StoryPersonasDataModel';

const tableName = 'storyRevisions';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    revisionNumber: {
        type: DataTypes.INTEGER
    },
    data: {
        type: DataTypes.JSONB
    },
    acceptanceCriteria: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('acceptanceCriteria')
    },
    completionState: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('completionState')
    },
    modificationState: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('modificationState')
    },
    size: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('size')
    },
    mockup: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('mockup')
    },
    screenshot: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('screenshot')
    },
    billingCode: {
        type: DataTypes.VIRTUAL,
        ...getDataGettersAndSetters('billingCode')
    }
};

export default class StoryRevisionsDataModel extends Model implements StoryRevision {

    id: number;
    storyId: number;
    story: Story;
    revisionNumber: number;
    description: string;
    acceptanceCriteria: AcceptanceCriteria[];
    releaseState: ReleaseState;
    modificationState: ModificationState;
    mockup: string;
    screenshot: string;

    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        story: Association<StoryRevisionsDataModel, StoriesDataModel>
        personas: Association<StoryRevisionsDataModel, StoryPersonasDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        StoryRevisionsDataModel.init(columnMappings, { sequelize, tableName });
        StoryRevisionsDataModel.belongsTo(StoriesDataModel, {
            as: 'story',
            foreignKey: 'storyId'
        });
    }

    public static toDataModel(revision: StoryRevision): StoryRevisionsDataModel {
        return {
            ...revision,
            storyId: revision.story.id
        } as unknown as StoryRevisionsDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toStoryRevision(model: StoryRevisionsDataModel): StoryRevision {
        const revision = model.toJSON ? model.toJSON() : model;
        delete revision.storyId;
        delete revision.data;
        delete revision.createdAt;
        delete revision.updatedAt;
        delete revision.updatedBy;
        return revision;
    }
}

enableDataModelLogging(StoryRevisionsDataModel);

enableFindIncludeOptions(StoryRevisionsDataModel, () => [
    {
        association: StoryRevisionsDataModel.associations.story,
        include: [
            {
                association: StoriesDataModel.associations.feature,
                include: [{
                    association: FeaturesDataModel.associations.product,
                    include: [{
                        association: ProductsDataModel.associations.organization
                    }]
                }]
            }
        ]
    }
]);

enableCreateUpdateDataModelTransformation(StoryRevisionsDataModel, (data) => {
    return StoryRevisionsDataModel.toDataModel(data);
});
