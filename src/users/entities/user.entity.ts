export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: UserRole = UserRole.USER;
  createdAt?: Date;
  updatedAt?: Date;
}
