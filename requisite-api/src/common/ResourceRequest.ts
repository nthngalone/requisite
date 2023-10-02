import type { Request  } from 'express';
import type SecurityContext from '@requisite/model/lib/user/SecurityContext';
import type Organization from '@requisite/model/lib/org/Organization';
import type Product from '@requisite/model/lib/product/Product';
import type Entity from '@requisite/model/lib/Entity';
import type Feature from '@requisite/model/lib/product/Feature';
import type Story from '@requisite/model/lib/story/Story';

export default interface ResourceRequest extends Request {
    securityContext?: SecurityContext;
    organization?: Organization;
    product?: Product;
    feature?: Feature;
    story?: Story;
    entity?: Entity;
}
