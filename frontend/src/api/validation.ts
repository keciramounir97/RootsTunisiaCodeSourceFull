/**
 * Zod schemas for client-side validation
 * Use with react-hook-form + @hookform/resolvers/zod
 */
import { z } from "zod";

const MAX_TITLE = 500;
const MAX_TEXT = 10000;
const MAX_STRING = 500;

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_TITLE),
  author: z.string().max(MAX_STRING).optional(),
  description: z.string().max(MAX_TEXT).optional(),
  category: z.string().max(MAX_STRING).optional(),
  archiveSource: z.string().max(MAX_STRING).optional(),
  documentCode: z.string().max(MAX_STRING).optional(),
  isPublic: z.boolean().optional(),
});

export const treeSchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_TITLE),
  description: z.string().max(MAX_TEXT).optional(),
  archiveSource: z.string().max(MAX_STRING).optional(),
  documentCode: z.string().max(MAX_STRING).optional(),
  isPublic: z.boolean().optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_TITLE),
  description: z.string().max(MAX_TEXT).optional(),
  location: z.string().max(MAX_STRING).optional(),
  year: z.string().max(50).optional(),
  photographer: z.string().max(MAX_STRING).optional(),
  isPublic: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(MAX_STRING),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(50).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(MAX_STRING),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(MAX_TEXT),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export function validateWithZod(schema: z.ZodSchema<any>, data: any) {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  const errors = result.error.flatten().fieldErrors;
  const message = result.error.issues.map((e: any) => e.message).join("; ");
  return { success: false, errors, message };
}

