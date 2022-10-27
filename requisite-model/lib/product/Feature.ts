import Entity from '../Entity';
import Product from './Product';
import Story from '../story/Story';

export default interface Feature extends Entity {

    product?: Product;
    name: string;
    description: string;
    stories?: Story[];
}
