import { z } from "zod";

export const SignInFormSchema = z.object({
    email: z.string().trim().min(1,"Required").email(),
    password: z.string().min(1,"Required").max(256),
});

export const signUpFormSchema = z.object({
    email: z.string().trim().min(1,"Required").email(),
    password: z.string().min(8,"Minimum 8 characters required").max(256),
    name: z.string().trim().min(1,"Required"),
})
