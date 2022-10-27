import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';
import Membership from '@requisite/model/lib/user/Membership';
import User from '@requisite/model/lib/user/User';
import SecurityService from '../services/SecurityService';

export default class HeaderNavigationStateManager {

    private securityService: SecurityService = new SecurityService();

    public user: User = {} as User;
    public systemAdmin = false;
    public systemError = false;
    public orgMemberships = [] as Membership<Organization>[];
    public productMemberships = [] as Membership<Product>[];

    async initialize(secured: boolean): Promise<void> {
        if (secured) {
            try {
                this.reset();
                const {
                    user,
                    systemAdmin,
                    orgMemberships,
                    productMemberships
                } = await this.securityService.getContext();
                this.user = user;
                this.systemAdmin = systemAdmin;
                this.orgMemberships = orgMemberships;
                this.productMemberships = productMemberships;
            } catch (error) {
                console.error('A unexpected error was encountered.', error);
                this.systemError = true;
            }
        }
    }

    async logout(): Promise<void> {
        try {
            this.reset();
            await this.securityService.logout();
        } catch (error) {
            console.error('A unexpected error was encountered.', error);
            this.systemError = true;
        }

    }

    reset(): void {
        this.systemError = false;
    }
}
