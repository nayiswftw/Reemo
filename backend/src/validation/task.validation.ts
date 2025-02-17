import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";

// Basic validation for task title with length constraints
export const titleSchema = z.string().trim().min(1).max(255);

// Optional description field
export const descriptionSchema = z.string().trim().optional();

// Nullable and optional assigned user identifier
export const assignedToSchema = z.string().trim().min(1).nullable().optional();

// Task priority validation using enum values
export const prioritySchema = z.nativeEnum(TaskPriorityEnum);

// Task status validation using enum values
export const statusSchema = z.nativeEnum(TaskStatusEnum);

// Optional due date with format validation
export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format. Please provide a valid date string.",
  });

// Task ID validation
export const taskIdSchema = z.string().trim().min(1);

// Schema for creating new tasks
export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

// Schema for updating existing tasks
export const updateTaskSchema = createTaskSchema;
