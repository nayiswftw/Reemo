import { z } from "zod";

// Basic field schemas for project properties
export const emojiSchema = z.string().trim().optional(); 
export const nameSchema = z.string().trim().min(1).max(255); 
export const descriptionSchema = z.string().trim().optional();
export const projectIdSchema = z.string().trim().min(1);

// Schema for creating new projects
export const createProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
}).strict();

// Schema for updating existing projects
export const updateProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
}).partial();