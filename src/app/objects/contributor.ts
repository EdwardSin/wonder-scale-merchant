import { Role } from '@enum/Role.enum';

export class Contributor {
    user?: string;
    role?: Role;
    firstName?: string;
    lastName?: string;
    email?: string;
    invitedBy?: Date;
    invitedDate?: Date;
    joinedDate?: Date;
    profileImage?: string;
    status?: StatusType;
}

type StatusType = 'active' | 'pending' | 'rejected';