import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((val) => val === " " ? null : val)
    ]).optional().nullable(),        
})
