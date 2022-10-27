import OrganizationsService from './OrganizationsService';
import OrganizationsServiceSqlzImpl from './OrganizationsServiceSqlzImpl';
import SecurityService from './SecurityService';
import SecurityServiceSqlzImpl from './SecurityServiceSqlzImpl';
import UsersService from './UsersService';
import UsersServiceSqlzImpl from './UsersServiceSqlzImpl';
import SystemService from './SystemService';
import SystemServiceSqlzImpl from './SystemServiceSqlzImpl';
import ProductsService from './ProductsService';
import ProductsServiceSqlzImpl from './ProductsServiceSqlzImpl';
import FeaturesService from './FeaturesService';
import FeaturesServiceSqlzImpl from './FeaturesServiceSqlzImpl';
import StoriesService from './StoriesService';
import StoriesServiceSqlzImpl from './StoriesServiceSqlzImpl';
import StoryRevisionsServiceSqlzImpl from './StoryRevisionsServiceSqlzImpl';
import StoryRevisionsService from './StoryRevisionsService';
import ProductConstituentsService from './ProductConstituentsService';
import ProductConstituentsServiceSqlzImpl from './ProductContituentsServiceSqlzImpl';

export default {
    getSecurityService(): SecurityService {
        return new SecurityServiceSqlzImpl();
    },
    getUsersService(): UsersService {
        return new UsersServiceSqlzImpl();
    },
    getOrganizationsService(): OrganizationsService {
        return new OrganizationsServiceSqlzImpl();
    },
    getProductsService(): ProductsService {
        return new ProductsServiceSqlzImpl();
    },
    getProductConstituentsService(): ProductConstituentsService {
        return new ProductConstituentsServiceSqlzImpl();
    },
    getFeaturesService(): FeaturesService {
        return new FeaturesServiceSqlzImpl();
    },
    getStoriesService(): StoriesService {
        return new StoriesServiceSqlzImpl();
    },
    getStoryRevisionsService(): StoryRevisionsService {
        return new StoryRevisionsServiceSqlzImpl();
    },
    getSystemService(): SystemService {
        return new SystemServiceSqlzImpl();
    }
};
