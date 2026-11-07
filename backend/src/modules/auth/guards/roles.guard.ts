import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/** Role IDs: 1=admin, 2=user, 3=super_admin */
const ROLE_NAME_BY_ID: Record<number, string> = {
    1: 'admin',
    2: 'user',
    3: 'super_admin',
};

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
        const normalizedRoleName = roleName || ROLE_NAME_BY_ID[roleId] || '';
        const normalizedRequired = requiredRoles.map((r) => String(r).toLowerCase());

        // Super admins can access any admin-protected route
        if (normalizedRoleName === 'super_admin' || roleId === 3) return true;

        // Regular admins only when explicitly allowed
        if (normalizedRequired.includes(normalizedRoleName)) return true;
        if (roleId === 1 && normalizedRequired.includes('admin')) return true;

        return false;
    }
}
