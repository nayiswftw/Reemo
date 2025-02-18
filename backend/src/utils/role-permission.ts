import {
  Roles,
  Permissions,
  PermissionType,
  RoleType,
} from "../enums/role.enum";

// Define permission sets for each role type in the system
export const RolePermissions: Record<RoleType, Array<PermissionType>> = {
  // Owner has full system access with all available permissions
  OWNER: [
    // Workspace management
    Permissions.CREATE_WORKSPACE,
    Permissions.EDIT_WORKSPACE,
    Permissions.DELETE_WORKSPACE,
    Permissions.MANAGE_WORKSPACE_SETTINGS,

    // Member management
    Permissions.ADD_MEMBER,
    Permissions.CHANGE_MEMBER_ROLE,
    Permissions.REMOVE_MEMBER,

    // Project management
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.DELETE_PROJECT,

    // Task management
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,

    Permissions.VIEW_ONLY,
  ],

  // Admin has elevated access but cannot modify workspace structure
  ADMIN: [
    Permissions.ADD_MEMBER,
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.DELETE_PROJECT,
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
    Permissions.MANAGE_WORKSPACE_SETTINGS,
    Permissions.VIEW_ONLY,
  ],

  // Member has basic task management capabilities
  MEMBER: [
    Permissions.VIEW_ONLY,
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
  ],
};