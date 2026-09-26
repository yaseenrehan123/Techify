"use client";
import { useAuthFloatingModalContext } from '@/contexts/AuthFloatingModalContext'
import { CardDescription, CardHeader } from '@/components/ui/card';
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateUserFields, LoginFields, SignupFields } from '@/lib/types';
import signUpSchema from '@/schemas/signUpSchema';
import Alignment from '@/components/ui/custom/alignment';
import Message from '@/components/ui/custom/message';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '@/actions/userActions';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import loginSchema from '@/schemas/loginSchema';

const LoginForm = () => {
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { signIn, fetchStatus } = useSignIn();
    const { setMode } = useAuthFloatingModalContext();
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema)
    });

    const isReady = fetchStatus === "idle" && signIn;
    const onSubmit = async ({ email, password }: LoginFields) => {
        if (!isReady) {
            console.log("SIGNUP NOT READY!")
            return
        }
        try {
            const { error } = await signIn.create({
                identifier: email,
                password: password,
            });

            if (error) {
                //console.error("Clerk Error:", JSON.stringify(error, null, 2));
                if (isClerkAPIResponseError(error)) {
                    const clerkError = error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "An error occurred";
                    setIsError(true);
                    setErrorMessage(clerkError)
                    console.error(clerkError);
                    return;
                }
                else {
                    // Handle non-Clerk errors (network issues, etc.)
                    console.error("An unexpected error occurred", error);
                }
            }
            //console.log("Clerk ID:", signIn.id)


            await signIn.finalize();
            setMode(undefined);
            reset();
        }
        catch (err: any) {
            console.error("DEBUG ERROR:", err)
            const errorMessage = err.errors?.[0]?.message || "Something went wrong";
            setErrorMessage(errorMessage);
            setIsError(true);
        }

    }
    return (
        <div className='flex flex-col gap-4'>
            <CardHeader className='text-3xl font-bold'>
                Login
            </CardHeader>
            <CardDescription className='w-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-6'>
                    <Alignment variant='colLeft' className='w-full'>
                        <Input className='text-brand-text rounded-4xl border border-brand-border px-4'
                            placeholder='Email' {...register("email")} />
                        {errors.email && <Message content={errors.email?.message} variant='error' />}
                    </Alignment>
                    <Alignment variant='colLeft' className='w-full'>
                        <Input className='text-brand-text rounded-4xl border border-brand-border px-4'
                            placeholder='Password' {...register("password")} />
                        {errors.password && <Message content={errors.password?.message} variant='error' />}
                    </Alignment>
                    <div id="clerk-captcha" />
                    <Alignment variant='rowCenter' className='w-full'>
                        <Message
                            variant={isSubmitting ? "loading" : isSubmitSuccessful ? "success" : isError ? "error" : "default"}
                            content={isSubmitting ? "Loading..." : isSubmitSuccessful ? "Success!" : isError ? errorMessage : ""}
                            disableOnContent='md' />
                    </Alignment>
                    <div className='w-full flex justify-end items-center gap-2'>
                        <Button variant={"default"} size={"lg"}
                            className={`bg-transparent border border-brand-border text-brand-white hover:cursor-pointer
                                hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={() => setMode(undefined)}>
                            Cancel
                        </Button>
                        <Button variant={"default"} type='submit' size={"lg"}
                            className={`bg-transparent border border-brand-border text-brand-white hover:cursor-pointer
                                hover:bg-brand-dark-hover transition-all duration-150`}>
                            Submit
                        </Button>
                    </div>

                </form>
            </CardDescription>
        </div>
    )
}

export default LoginForm