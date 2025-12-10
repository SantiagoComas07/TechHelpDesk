import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

export const RequireRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
