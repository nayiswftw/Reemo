import { z } from "zod";

// Basic reusable schemas
export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(255, { message: "Name must not exceed 255 characters" });

// Optional description field with trimming
export const descriptionSchema = z.string().trim().optional();

// Workspace identifier validation
export const workspaceIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Workspace ID is required" });

// Schema for role changes within workspace
export const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1, { message: "Role ID is required" }),
  memberId: z.string().trim().min(1, { message: "Member ID is required" }),
});

// Schema for creating new workspaces
export const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

// Schema for updating existing workspaces
export const updateWorkspaceSchema = createWorkspaceSchema;