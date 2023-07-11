import PersonasDataModel from './sqlz/data-models/PersonasDataModel';
import { runWithSequelize } from './sqlz/SqlzUtils';
import Product from '@requisite/model/lib/product/Product';
import { getLogger } from '../util/Logger';
import PersonasService from './PersonasService';
import Persona from '@requisite/model/lib/product/Persona';
import { NotFoundError } from '../util/ApiErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/PersonasServiceSqlzImpl');

export default class PersonasServiceSqlzImpl
implements PersonasService {
    async listPersonas(product: Product): Promise<Persona[]> {
        return (await runWithSequelize(async (sqlz) => {
            PersonasDataModel.initialize(sqlz);
            return PersonasDataModel.findAll({
                where: { productId: product.id }
            });
        })).map(data => PersonasDataModel.toPersona(data));
    }
    async getPersona(id: number): Promise<Persona> {
        const persona = await runWithSequelize(async (sqlz) => {
            PersonasDataModel.initialize(sqlz);
            return PersonasDataModel.findByPk(id);
        });
        return persona
            ? PersonasDataModel.toPersona(persona)
            : null;
    }
    async createPersona(persona: Persona): Promise<Persona> {
        return PersonasDataModel.toPersona(
            await runWithSequelize(async (sqlz) => {
                PersonasDataModel.initialize(sqlz);
                const { id } =
                    await PersonasDataModel.create({ ...persona });
                return PersonasDataModel.findByPk(id);
            })
        );
    }
    async updatePersona(persona: Persona): Promise<Persona> {
        const [count] = await runWithSequelize(async (sqlz) => {
            PersonasDataModel.initialize(sqlz);
            const { id } = persona;
            return PersonasDataModel.update(
                persona,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return persona;
    }
    async deletePersona(persona: Persona): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = persona;
            PersonasDataModel.initialize(sqlz);
            return PersonasDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }

}
