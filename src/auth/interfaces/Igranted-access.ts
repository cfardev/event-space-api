import { UserRole } from '@prisma/client';

export interface IGrantedAccess {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    photoUrl: string;
  };
}
