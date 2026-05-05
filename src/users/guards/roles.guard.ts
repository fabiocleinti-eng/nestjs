import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private allowedRoles: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(`Only ${this.allowedRoles.join(', ')} users can access this resource`);
    }

    return true;
  }
}
