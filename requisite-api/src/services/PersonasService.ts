import type Product from '@requisite/model/lib/product/Product';
import type Persona from '@requisite/model/lib/product/Persona';

export default interface PersonasService {
    listPersonas(product: Product): Promise<Persona[]>;
    getPersona(id: number): Promise<Persona>;
    createPersona(persona: Persona): Promise<Persona>;
    updatePersona(persona: Persona): Promise<Persona>;
    deletePersona(persona: Persona): Promise<void>;
}
