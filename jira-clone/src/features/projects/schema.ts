import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  workspaceId: z.string(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((val) => val === " " ? null : val)
  ]).optional().nullable(),
});

export const editProjectSchema = z.object({
  name: z.string().min(1, "Minimum 1 character is required").optional(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((val) => val === " " ? null : val)
  ]).optional().nullable(),
});
