"use client";
import { createComment } from '@/actions/postActions';
import { Button } from '@/components/ui/button'
import Alignment from '@/components/ui/custom/alignment';
import Message from '@/components/ui/custom/message';
import { Input } from '@/components/ui/input'
import { usePostDetailsContext } from '@/contexts/PostDetailsContext';
import { formatTimeAgo } from '@/lib/formatTime';
import { CreateCommentFields, CreateCommentFormFields, FetchCommentsFromPostReturn } from '@/lib/types';
import createCommentFormSchema from '@/schemas/createCommentFormSchema';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const AddCommentForm = () => {
    const { user } = useUser();
    const [enabled, setEnabled] = useState<boolean>(false)
    const { id } = usePostDetailsContext();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCommentFormFields>({
        resolver: zodResolver(createCommentFormSchema)
    });
    const { mutateAsync, isPending, isError, isSuccess, error } = useMutation({
        mutationKey: ["createComment", id],
        mutationFn: createComment,
        onMutate: async (newCommentVariables: CreateCommentFields) => {
            const queryKey = ["fetchComments", id];

            // 1. Cancel outgoing fetches so they don't overwrite optimistic update
            await queryClient.cancelQueries({ queryKey });

            // 2. Snapshot previous cache value for rollback
            const previousComments = queryClient.getQueryData<InfiniteData<FetchCommentsFromPostReturn>>(queryKey);

            // 3. Create a temporary optimistic comment item
            const optimisticComment = {
                id: `temp-${Date.now()}`,
                postId: id,
                username: user?.username || user?.firstName || "You",
                text: newCommentVariables.text,
                userClerkId: user?.id ?? "",
                isByUser: true,
                user: undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // 4. Prepend the new comment to the first page of the infinite query cache
            queryClient.setQueryData<InfiniteData<FetchCommentsFromPostReturn>>(queryKey, (oldData) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

                const firstPage = oldData.pages[0];
                const updatedFirstPage = {
                    ...firstPage,
                    comments: [optimisticComment, ...firstPage.comments],
                };

                return {
                    ...oldData,
                    pages: [updatedFirstPage, ...oldData.pages.slice(1)],
                };
            });

            return { previousComments };
        },
        onError: (_err, _variables, context) => {
            // Roll back to previous cache state if server request fails
            if (context?.previousComments) {
                queryClient.setQueryData(["fetchComments", id], context.previousComments);
            }
        },
        onSettled: () => {
            // Refetch in background to sync temporary ID with actual DB ID
            queryClient.invalidateQueries({
                queryKey: ["fetchComments", id]
            });
        },
        onSuccess: () => {
            reset();
            setEnabled(false)
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