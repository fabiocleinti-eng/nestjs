import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
