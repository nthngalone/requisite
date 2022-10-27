import Entity from '../Entity';
import Product from './Product';

export default interface Constituent extends Entity {

    product: Product;
    name: string;
    description: string;
    avatar: string;
}
