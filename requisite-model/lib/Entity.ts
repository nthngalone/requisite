import User from './user/User';

export default interface Entity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;
}
