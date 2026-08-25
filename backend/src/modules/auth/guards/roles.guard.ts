import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/** Role IDs: 1=admin, 2=user, 3=super_admin */
const ADMIN_ROLE_IDS = [1, 3];

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest();
        if (!user) return false;

        const roleId = Number(user.role_id ?? user.roleId ?? user.role ?? 0);
        const roleName = String(user.roleName ?? user.role_name ?? '').toLowerCase().trim();

        // Admin role ids (1=admin, 3=super_admin) — grant access to admin/super_admin routes
        if (ADMIN_ROLE_IDS.includes(roleId)) return true;
        if (roleName && ['admin', 'super_admin'].includes(roleName)) return true;
        if (roleName && requiredRoles.some((r) => String(r).toLowerCase() === roleName)) return true;
        return false;
    }
}
