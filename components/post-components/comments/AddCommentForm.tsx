"use client";
import { createComment } from '@/actions/postActions';
import { Button } from '@/components/ui/button'
import Alignment from '@/components/ui/custom/alignment';
import Message from '@/components/ui/custom/message';
import { Input } from '@/components/ui/input'
import { usePostDetailsnContext } from '@/contexts/PostDetailsContext';
import { CreateCommentFields, CreateCommentFormFields } from '@/lib/types';
import createCommentFormSchema from '@/schemas/createCommentFormSchema';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const AddCommentForm = () => {
    const { user } = useUser();
    const [enabled, setEnabled] = useState<boolean>(false)
    const { id } = usePostDetailsnContext();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCommentFormFields>({
        resolver: zodResolver(createCommentFormSchema)
    });
    const { mutateAsync, isPending, isError, isSuccess, error } = useMutation({
        mutationKey: ["createComment", id],
        mutationFn: createComment,
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({
                queryKey: ["fetchComments", id]
            })
        },


    });
    const onSubmit = async ({ text }: CreateCommentFormFields) => {
        const obj: CreateCommentFields = {
            clerkId: user?.id ?? "",
            postId: id,
            text: text
        };
        await mutateAsync(obj);
    }
    return (
        <div className='w-full flex items-center  px-4 rounded-4xl text-brand-text
                border-2 border-brand-border border-solid'>
            <form className='w-full flex items-center flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}>
                <Alignment className='w-full' variant='colCenter'>
                    <Input className='w-full rounded-4xl border-none '
                        placeholder='Join The Conversation'
                        onFocus={() => setEnabled(true)} {...register("text")} />
                    {errors.text && <Message content={errors.text?.message} variant='error' />}
                </Alignment>
                <Alignment className='w-full' variant='colCenter'>
                    <Message content={isPending ? "Loading..." : isError ? error.message : isSuccess ? "Success!" : ""}
                        variant={isPending ? "loading" : isError ? "error" : isSuccess ? "success" : "default"} disableOnContent='md' />
                </Alignment>
                {enabled && <div className='w-full flex items-center justify-end gap-2'>
                    <Button variant={"default"} size={"lg"}
                        onClick={() => setEnabled(false)}
                        className={`border border-brand-border text-brand-white hover:cursor-pointer hover:bg-brand-dark-hover
                                transition-all duration-150 `}>
                        Cancel
                    </Button>
                    <Button variant={"default"} size={"lg"}
                        className={`bg-brand-accent text-brand-white hover:cursor-pointer hover:bg-[#2A9875]
                                transition-all duration-150 `} type='submit'>
                        Submit
                    </Button>
                </div>}
            </form>

        </div>

    )
}

export default AddCommentForm