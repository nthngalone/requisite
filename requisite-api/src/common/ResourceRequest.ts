import { Request  } from 'express';
import SecurityContext from '@requisite/model/lib/user/SecurityContext';
import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';
import Entity from '@requisite/model/lib/Entity';
import Feature from '@requisite/model/lib/product/Feature';
import Story from '@requisite/model/lib/story/Story';

export default interface ResourceRequest extends Request {
    securityContext?: SecurityContext;
    organization?: Organization;
    product?: Product;
    feature?: Feature;
    story?: Story;
    entity?: Entity;
}
