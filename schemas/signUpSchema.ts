import * as z from "zod";

export const signUpSchema = z.object({
        email: z.string().email({message: "Invalid email address"}),
        password: z.string().min(1, {message: "Password is required"}).min(8, {message: "Password must be at least 8 characters long"}),
        confirmPassword: z.string().min(1, {message: "Confirm password is required"}),
}).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
});

export type SignUpSchema = z.infer<typeof signUpSchema>;