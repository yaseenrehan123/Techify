"use client";
import { useAuthFloatingModalContext } from '@/contexts/AuthFloatingModalContext'
import { CardDescription, CardHeader } from '@/components/ui/card';
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateUserFields, SignupFields } from '@/lib/types';
import signUpSchema from '@/schemas/signUpSchema';
import Alignment from '@/components/ui/custom/alignment';
import Message from '@/components/ui/custom/message';
import { Button } from '@/components/ui/button';
import { useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import OAuthContainer from '../OAuthContainer';

const SignupForm = () => {
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { signUp, fetchStatus } = useSignUp();
    const { setMode } = useAuthFloatingModalContext();
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm<SignupFields>({
        resolver: zodResolver(signUpSchema)
    });
    // const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    //     mutationKey: ["signupForm"],
    //     mutationFn: createUser,
    //     onSuccess: () => {
    //         setMode("verify");
    //         reset();
    //     }
    // });
    const isReady = fetchStatus === "idle" && signUp;
    const onSubmit = async ({ username, email, password }: SignupFields) => {
        if (!isReady) {
            console.log("SIGNUP NOT READY!")
            return
        }
        setIsError(false);
        setErrorMessage("");
        try {
            await signUp.password({
                emailAddress: email,
                password: password,
                //username: username
            });

            /*if (error) {
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
            }*/
            console.log("Clerk ID:", signUp.id)
            // await mutateAsync({
            //     clerkId: signUp.id!,
            //     username: username,
            //     email: email
            // });

            await signUp.verifications.sendEmailCode();

            setMode("verify");
            reset();
        }
        catch (err: any) {
            // console.error("DEBUG ERROR:", err)
            // const errorMessage = err.errors?.[0]?.message || "Something went wrong";
            // setErrorMessage(errorMessage);
            // setIsError(true);
            //console.error("Clerk Error:", JSON.stringify(error, null, 2));
            setIsError(true);
            if (isClerkAPIResponseError(err)) {
                const clerkError = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "An error occurred";
                setErrorMessage(clerkError)
                console.error(clerkError);
            }
            else {
                // Handle non-Clerk errors (network issues, etc.)
                setErrorMessage((err as Error).message)
                console.error("An unexpected error occurred", err);
            }
            throw err
        }

    }
    return (
        <div className='flex flex-col gap-4 '>
            <CardHeader className='text-3xl font-bold'>
                SignUp
            </CardHeader>
            <CardDescription className='w-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-6'>
                    <Alignment variant='colLeft' className='w-full'>
                        <Input className='text-brand-text rounded-4xl border border-brand-border px-4'
                            placeholder='Username' {...register("username")} />
                        {errors.username && <Message content={errors.username?.message} variant='error' />}
                    </Alignment>
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
                    <Alignment variant='colLeft' className='w-full'>
                        <Input className='text-brand-text rounded-4xl border border-brand-border px-4'
                            placeholder='Confirm Password' {...register("confirmPassword")} />
                        {errors.confirmPassword && <Message content={errors.confirmPassword?.message} variant='error' />}
                    </Alignment>
                    <div id="clerk-captcha" />
                    <OAuthContainer />
                    <Alignment variant='rowCenter' className='w-full'>
                        <Message
                            variant={isSubmitting ? "loading" : isSubmitSuccessful ? "success" : isError ? "error" : "default"}
                            content={isError ? errorMessage : isSubmitting ? "Loading..." : isSubmitSuccessful ? "Success!" : ""}
                            disableOnContent={isError ? "never" : "md"} />
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

export default SignupForm