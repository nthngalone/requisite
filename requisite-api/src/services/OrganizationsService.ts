import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';

export default interface OrganizationsService {
    listOrgs(): Promise<Organization[]>;
    getOrg(id: number): Promise<Organization>;
    createOrg(org: Organization): Promise<Organization>;
    updateOrg(org: Organization): Promise<Organization>;
    deleteOrg(org: Organization): Promise<void>;
    listMemberships(org: Organization): Promise<Membership<Organization>[]>;
    getMembership(id: number): Promise<Membership<Organization>>;
    addMembership(
        membership: Membership<Organization>
    ): Promise<Membership<Organization>>;
    updateMembership(
        membership: Membership<Organization>
    ): Promise<Membership<Organization>>;
    removeMembership(
        membership: Membership<Organization>
    ): Promise<void>;
}
