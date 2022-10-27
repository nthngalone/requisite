import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import { getSecurityResourceRouter } from './resources/SecurityResourceRouter';
import { getSystemResourceRouter } from './resources/SystemResourceRouter';
import { getUsersResourceRouter } from './resources/UsersResourceRouter';
import { getOrganizationsResourceRouter } from './resources/OrganizationsResourceRouter';
import { getErrorHandler } from './common/ResourceErrorHandler';
import { getNotFoundHandler } from './common/ResourceNotFoundHandler';
import { getAuditHandler } from './common/ResourceAuditHandler';
import { getJwtResponseHandler } from './common/ResourceJwtResponseHandler';
import { getProductsResourceRouter } from './resources/ProductsResourceRouter';
import { getOrganizationMembershipsResourceRouter } from './resources/OrganizationMembershipsResourceRouter';

const getApp = (): Express => {

    const app = express();

    // Middleware plugins for common request/response handling
    app.use(cors());
    app.use(getAuditHandler());
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(getJwtResponseHandler());

    // Resource Routers
    app.use('/orgs/:orgId/memberships', getOrganizationMembershipsResourceRouter());
    app.use('/orgs/:orgId/products', getProductsResourceRouter());
    app.use('/orgs', getOrganizationsResourceRouter());
    app.use('/security', getSecurityResourceRouter());
    app.use('/system', getSystemResourceRouter());
    app.use('/users', getUsersResourceRouter());

    // Hello World Sanity Check
    app.get('/', (req, res) => res.send('Hello World from Requisite!'));

    // Custom Not Found Handler Middleware
    app.use(getNotFoundHandler());

    // Custom Error Handler Middleware
    app.use(getErrorHandler());

    return app;
};

export { getApp };
