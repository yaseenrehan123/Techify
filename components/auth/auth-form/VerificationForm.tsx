"use client";
import { useAuthFloatingModalContext } from '@/contexts/AuthFloatingModalContext'
import { CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react'
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateUserFields, SignupFields, VerificationFields } from '@/lib/types';
import signUpSchema from '@/schemas/signUpSchema';
import Alignment from '@/components/ui/custom/alignment';
import Message from '@/components/ui/custom/message';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '@/actions/userActions';
import { useSignUp } from '@clerk/nextjs';
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import verificationSchema from '@/schemas/verificationSchema';

const VerificationForm = () => {
    const { signUp, fetchStatus } = useSignUp();
    const { setMode } = useAuthFloatingModalContext();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<VerificationFields>({
        resolver: zodResolver(verificationSchema)
    });
    const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
        mutationKey: ["signupForm"],
        mutationFn: createUser,
        // onSuccess: () => {
        //     setMode(undefined);
        //     reset();
        // }
    });
    const isReady = fetchStatus === "idle" && signUp;
    const onSubmit = async ({ code }: VerificationFields) => {
        if (!isReady) {
            console.log("SIGNUP NOT READY!")
            return
        }
        try {

            const { error } = await signUp.verifications.verifyEmailCode({
                code: code,
            });
            if (error) {
                if (isClerkAPIResponseError(error)) {
                    const clerkError = error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "An error occurred";
                    // setIsError(true);
                    // setMessage(clerkError)
                    console.error(clerkError)
                }
                else {
                    console.error("An unexpected error occurred", error);
                }
            }

            if (signUp.status === "complete") {
                await signUp.finalize();

                await mutateAsync({
                    clerkId: signUp.id!,
                    username: signUp.username ?? "",
                    email: signUp.emailAddress!
                });
                setMode(undefined);
                reset();
            } else {
                console.error("Sign-up not complete. Current status:", signUp.status);

            }
        } catch (err: any) {
            console.error(err);
        }

    }
    return (
        <div className='flex flex-col gap-4'>
            <CardHeader className='text-3xl font-bold'>
                Verify Your Account
            </CardHeader>
            <CardDescription className='w-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-6'>
                    <Alignment variant='colLeft' className='w-full'>
                        <Input className='text-brand-text rounded-4xl border border-brand-border px-4'
                            placeholder='Code' {...register("code")} />
                        {errors.code && <Message content={errors.code?.message} variant='error' />}
                    </Alignment>

                    <div id="clerk-captcha" />
                    <Alignment variant='rowCenter' className='w-full'>
                        <Message
                            variant={isPending ? "loading" : isSuccess ? "success" : isError ? "error" : "default"}
                            content={isPending ? "Loading..." : isSuccess ? "Success!" : isError ? error.message : ""}
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

export default VerificationForm