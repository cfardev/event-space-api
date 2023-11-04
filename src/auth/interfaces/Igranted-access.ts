import { UserRole } from '@prisma/client';

export interface IGrantedAccess {
  token: string;
  user: {
    username: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    photoUrl: string;
  };
}
