import type OrganizationsService from './OrganizationsService';
import OrganizationsServiceSqlzImpl from './OrganizationsServiceSqlzImpl';
import type SecurityService from './SecurityService';
import SecurityServiceSqlzImpl from './SecurityServiceSqlzImpl';
import type UsersService from './UsersService';
import UsersServiceSqlzImpl from './UsersServiceSqlzImpl';
import type SystemService from './SystemService';
import SystemServiceSqlzImpl from './SystemServiceSqlzImpl';
import type ProductsService from './ProductsService';
import ProductsServiceSqlzImpl from './ProductsServiceSqlzImpl';
import type FeaturesService from './FeaturesService';
import FeaturesServiceSqlzImpl from './FeaturesServiceSqlzImpl';
import type StoriesService from './StoriesService';
import StoriesServiceSqlzImpl from './StoriesServiceSqlzImpl';
import StoryRevisionsServiceSqlzImpl from './StoryRevisionsServiceSqlzImpl';
import type StoryRevisionsService from './StoryRevisionsService';
import type PersonasService from './PersonasService';
import PersonasServiceSqlzImpl from './PersonasServiceSqlzImpl';

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
    getPersonasService(): PersonasService {
        return new PersonasServiceSqlzImpl();
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
