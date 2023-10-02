import {
    enableCreateUpdateDataModelTransformation,
    enableDataModelLogging,
    enableFindIncludeOptions
} from '../SqlzUtils';
import {
    Sequelize,
    Model,
    DataTypes,
    Association
} from 'sequelize';
import type User from '@requisite/model/lib/user/User';
import type StoryRevision from '@requisite/model/lib/story/StoryRevision';
import type StoryPersona from '@requisite/model/lib/story/StoryPersona';
import type Persona from '@requisite/model/lib/product/Persona';
import StoryRevisionsDataModel from './StoryRevisionsDataModel';
import PersonasDataModel from './PersonasDataModel';

const tableName = 'storyPersonas';

const columnMappings = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storyRevisionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    personaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

export default class StoryPersonasDataModel extends Model implements StoryPersona {

    id: number;
    storyRevisionId: number;
    storyRevision: StoryRevision;
    personaId: number;
    persona: Persona;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;

    public static associations: {
        storyRevision: Association<StoryPersonasDataModel, StoryRevisionsDataModel>
        persona: Association<StoryPersonasDataModel, PersonasDataModel>
    };

    public static initialize(sequelize: Sequelize): void {
        StoryPersonasDataModel.init(columnMappings, { sequelize, tableName });
        StoryRevisionsDataModel.belongsTo(StoryRevisionsDataModel, {
            as: 'storyRevision',
            foreignKey: 'storyRevisionId'
        });
        StoryRevisionsDataModel.belongsTo(PersonasDataModel, {
            as: 'persona',
            foreignKey: 'personaId'
        });
    }

    public static toDataModel(storyPersona: StoryPersona): StoryPersonasDataModel {
        return {
            ...storyPersona,
            storyRevisionId: storyPersona.storyRevision.id,
            personaId: storyPersona.persona.id,
        } as unknown as StoryPersonasDataModel;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toStoryPersona(model: StoryPersonasDataModel): StoryPersona {
        const storyPersona = model.toJSON ? model.toJSON() : model;
        delete storyPersona.storyRevisionId;
        delete storyPersona.personaId;
        delete storyPersona.data;
        delete storyPersona.createdAt;
        delete storyPersona.updatedAt;
        delete storyPersona.updatedBy;
        return storyPersona;
    }

    /**
     * Convert to a JSON object and remove some DB specific fields
     */
    public static toPersona(model: StoryPersonasDataModel): Persona {
        const storyPersona = model.toJSON ? model.toJSON() : model;
        return storyPersona.persona;
    }
}

enableDataModelLogging(StoryPersonasDataModel);

enableFindIncludeOptions(StoryPersonasDataModel, () => [
    { association: StoryPersonasDataModel.associations.storyRevision },
    { Association: StoryPersonasDataModel.associations.persona }
]);

enableCreateUpdateDataModelTransformation(StoryPersonasDataModel, (data) => {
    return StoryPersonasDataModel.toDataModel(data);
});
