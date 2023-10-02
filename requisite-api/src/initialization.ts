/* eslint-disable max-len */
import ServiceProvider from './services/ServiceProvider';
import { getLogger } from './util/Logger';
import requisiteData from '../requisite-data';
import { asyncForEachSerial } from '@requisite/utils/lib/lang/ArrayUtils';
import type Organization from '@requisite/model/lib/org/Organization';
import type Product from '@requisite/model/lib/product/Product';
import type Feature from '@requisite/model/lib/product/Feature';
import type Story from '@requisite/model/lib/story/Story';
import type StoryRevision from '@requisite/model/lib/story/StoryRevision';
import type Persona from '@requisite/model/lib/product/Persona';
import type User from '@requisite/model/lib/user/User';
import type Membership from '@requisite/model/lib/user/Membership';

const logger = getLogger('initialization');

export async function init(): Promise<void> {

    const systemService = ServiceProvider.getSystemService();
    const securityService = ServiceProvider.getSecurityService();

    try {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD,
            SYSADMIN_EMAIL,
            SYSADMIN_FIRST_NAME,
            SYSADMIN_LAST_NAME,
        } = process.env;

        // Initialize the system (sync databases)
        await systemService.initializeSystem();

        // Create the user for the system admin
        const user = await securityService.register({
            domain: SYSADMIN_DOMAIN,
            userName: SYSADMIN_USERNAME,
            password: SYSADMIN_PASSWORD,
            emailAddress: SYSADMIN_EMAIL,
            name: {
                firstName: SYSADMIN_FIRST_NAME,
                lastName: SYSADMIN_LAST_NAME
            },
            termsAgreement: true
        });

        logger.debug('Created user during initialization: ', JSON.stringify(user));

        // Add the new user as a system admin
        await ServiceProvider.getSystemService().addSystemAdmin(user);

        const admins = await ServiceProvider.getSystemService().listSystemAdmins();

        logger.debug('Admins created during initialization: ', JSON.stringify(admins));


        const organizationsService = ServiceProvider.getOrganizationsService();
        const productsService = ServiceProvider.getProductsService();
        const personasService = ServiceProvider.getPersonasService();
        const featuresService = ServiceProvider.getFeaturesService();
        const storiesService = ServiceProvider.getStoriesService();
        const storyRevisionsService = ServiceProvider.getStoryRevisionsService();

        // Add in initial test data

        const users = {} as Record<string, User>;

        // 1. create users
        const usersData = (requisiteData as unknown as Record<string, User[]>).users;
        const password = process.env.DEFAULT_USER_PASSWORD;
        await asyncForEachSerial(usersData, async (userData: User) => {
            const { domain, userName, emailAddress, name } = userData;
            users[userData.userName] = await securityService.register({
                domain,
                userName,
                password,
                emailAddress,
                name,
                termsAgreement: true
            });
        });

        const orgData = (requisiteData as unknown as Record<string, Organization>).organization;

        // 2. create org
        logger.debug('Creating organization: ', orgData.name);
        const organization = await organizationsService.createOrg(orgData);

        // 3. create org memberships
        const orgMembershipsData = orgData.memberships;
        await asyncForEachSerial(
            orgMembershipsData,
            async (membershipData: Membership<Organization>) => {
                const orgUser = users[membershipData.user.userName];
                await organizationsService.addMembership({
                    entity: organization,
                    user: orgUser,
                    role: membershipData.role
                } as Membership<Organization>);
            }
        );

        const productsData = orgData.products;
        // 4. create products
        await asyncForEachSerial(
            productsData,
            async (productData: Product) => {
                logger.debug('Creating product: ', productData.name);
                const product = await productsService.createProduct({
                    ...productData,
                    organization
                });
                // 5. create product memberships
                const productMembershipsData = productData.memberships;
                await asyncForEachSerial(
                    productMembershipsData,
                    async (membershipData: Membership<Product>) => {
                        const productUser = users[membershipData.user.userName];
                        await productsService.addMembership({
                            entity: product,
                            user: productUser,
                            role: membershipData.role
                        } as Membership<Product>);
                    }
                );
                // 6. create personas
                await asyncForEachSerial(
                    productData.personas,
                    async (personaData: Persona) => {
                        logger.debug('Creating persona: ', personaData.name);
                        await personasService.createPersona({
                            ...personaData,
                            product
                        });
                    }
                );
                // 7. create features
                await asyncForEachSerial(
                    productData.features,
                    async (featureData: Feature) => {
                        logger.debug('Creating feature: ', featureData.name);
                        const feature = await featuresService.createFeature({
                            ...featureData,
                            product
                        });
                        // 8. create stories
                        await asyncForEachSerial(
                            featureData.stories,
                            async (storyData: Story) => {
                                logger.debug('Creating story: ', storyData.title);
                                const story = await storiesService.createStory({
                                    ...storyData,
                                    feature
                                });
                                // 9. create story revisions
                                await asyncForEachSerial(
                                    storyData.revisions,
                                    async (revisionData: StoryRevision) => {
                                        let revision = await storyRevisionsService.getStoryRevisionByStoryAndRevision(story, revisionData.revisionNumber);
                                        if (!revision) {
                                            logger.debug('Creating new revision: ', revisionData.revisionNumber);
                                            revision = await storyRevisionsService.createStoryRevision(story);
                                        }
                                        logger.debug('Updating revision: ', revisionData.revisionNumber);
                                        await storyRevisionsService.updateStoryRevision({
                                            ...revision,
                                            ...revisionData,
                                            story
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    } catch(error) {
        logger.error('Error encountered during initialization', error);
    }
}
