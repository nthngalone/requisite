import { Request  } from 'express';
import SecurityContext from '@requisite/model/lib/user/SecurityContext';
import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';
import Entity from '@requisite/model/lib/Entity';

export default interface ResourceRequest extends Request {
    securityContext?: SecurityContext;
    organization?: Organization;
    product?: Product;
    entity?: Entity;
}
