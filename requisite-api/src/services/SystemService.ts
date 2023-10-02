import type SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import type User from '@requisite/model/lib/user/User';

export default interface SystemService {
    initializeSystem(): Promise<void>;
    listSystemAdmins(): Promise<SystemAdmin[]>;
    addSystemAdmin(user: User): Promise<SystemAdmin>;
    removeSystemAdmin(id: number): Promise<void>;
}
