import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorator/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (!user) throw new BadRequestException('User not found');

    if (validRoles.includes(user.idRole)) {
      return true;
    }

    throw new UnauthorizedException(`User ${user.fullName} need a valid role`);
  }
}
