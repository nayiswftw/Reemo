import { PermissionType, Permissions } from "../enums/role.enum";
import { UnauthorizedException } from "./appError";
import { RolePermissions } from "./role-permission";

/**
 * Validates if a role has all required permissions, throws if unauthorized
 */
export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionType[]
): void => {
  const rolePerms = RolePermissions[role];

  if (!requiredPermissions.every((perm) => rolePerms.includes(perm))) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};