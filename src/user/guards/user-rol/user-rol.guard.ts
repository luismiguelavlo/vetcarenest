import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entities/user.entity';
import { META_ROLES } from 'src/user/decorators/rol-protected.decorator';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new UnauthorizedException('User not found in request context');

    for (const rol of user.dataValues.rol) {
      if (validRoles.includes(rol)) {
        return true;
      }
    }

    throw new ForbiddenException('User role is not valid');
  }
}
