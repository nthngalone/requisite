import type User from '@requisite/model/lib/user/User';

export default interface UsersService {
    listUsers(): Promise<User[]>;
    getUser(criteria: UserSearchCriteria): Promise<User>;
    deleteUser(id: number): Promise<void>;
}

export interface UserSearchCriteria {
    domain?: string;
    id?: number;
    userName?: string;
    emailAddress?: string;
}
