import { z } from "zod";

// Email validation schema with common email rules
export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1, "Email is required")
  .max(255, "Email too long");

// Password validation schema with minimum length requirement
export const passwordSchema = z
  .string()
  .trim()
  .min(4, "Password must be at least 4 characters");

// Schema for user registration with name, email, and password
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name too long"),
  email: emailSchema,
  password: passwordSchema,
});

// Schema for user login with email and password
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});