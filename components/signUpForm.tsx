/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SignUpForm () {

        const router = useRouter();
        const [verifying, setVerifying] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [verificationCode, setVerificationCode] = useState("");
        const [verificationError, setVerificationError] = useState<string | null>(null);
        const [authError, setAuthError] = useState<string | null>(null);
        const { signUp, setActive, isLoaded } = useSignUp();


        const {register, handleSubmit, formState: {errors}} = useForm<z.infer<typeof signUpSchema>>({
                resolver: zodResolver(signUpSchema),
                defaultValues: {
                        email: "",
                        password: "",
                        confirmPassword: "",
                }
        });

        const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
                if(!isLoaded) return;
                setIsSubmitting(true);
                setAuthError(null);

                try {
                        await signUp.create({
                                emailAddress: data.email,
                                password: data.password,
                        });

                        await signUp.prepareEmailAddressVerification({
                                strategy: "email_code",
                        });

                        setVerifying(true);

                        if(signUp.status !== "complete") {
                                setAuthError(signUp.status);
                        }
                }
                catch (error: any) {
                        console.log("Signup Error: ", error);
                        setAuthError(error.errors?.[0]?.longMessage);
                }
                finally {
                        setIsSubmitting(false);
                }
        } 

        const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if(!isLoaded || !signUp) return;

                setIsSubmitting(true);
                setAuthError(null);

                try {
                        
                        const result = await signUp.attemptEmailAddressVerification({
                                code: verificationCode,
                        })
                        
                        console.log("Verification Result: ", result);

                        if(result.status === "complete") {
                                await setActive({
                                        session: result.createdSessionId,
                                });
                                router.push("/dashboard");

                        }
                        else {
                                console.error("Verification Error: ", result);
                                setVerificationError("Verification code is incorrect. Please try again. Not Completed");
                        }
                        
                } catch (error: any) {

                        console.log("Verification Error: ", error);
                        setVerificationError(error.errors?.[0]?.longMessage);
                } finally {
                        setIsSubmitting(false);
                }
        }

        if(verifying) {
                return <div>OTP Verifying...</div>
        }

        return (
                <h1>Signup form with email and other fields</h1>
        )
}