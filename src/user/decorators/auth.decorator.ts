import { ValidRoles } from '../interfaces/valid-roles';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRolGuard } from '../guards/user-rol/user-rol.guard';
import { RolProtected } from './rol-protected.decorator';

export function Auth(...args: ValidRoles[]) {
  return applyDecorators(
    RolProtected(...args),
    UseGuards(AuthGuard(), UserRolGuard),
  );
}
