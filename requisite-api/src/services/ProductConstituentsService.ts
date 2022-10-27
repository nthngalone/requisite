import Product from '@requisite/model/lib/product/Product';
import Constituent from '@requisite/model/lib/product/Constituent';

export default interface ProductConstituentsService {
    listConstituents(product: Product): Promise<Constituent[]>;
    getConstituent(id: number): Promise<Constituent>;
    createConstituent(constituent: Constituent): Promise<Constituent>;
    updateConstituent(constituent: Constituent): Promise<Constituent>;
    deleteConstituent(constituent: Constituent): Promise<void>;
}
