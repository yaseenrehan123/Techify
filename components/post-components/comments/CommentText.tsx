"use client";
import { editComment } from '@/actions/postActions';
import { Button } from '@/components/ui/button';
import Message from '@/components/ui/custom/message';
import MessageArea from '@/components/ui/custom/messageArea';
import { useCommentContainerContext } from '@/contexts/CommentContainerContext'
import { EditCommentFields, EditCommentFormFields, FetchCommentsFromPostReturn } from '@/lib/types';
import editCommentFormSchema from '@/schemas/editCommentFormSchema';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

const CommentText = () => {
    const { user } = useUser();
    const { text, isEditing, setIsEditing, username, id, postId } = useCommentContainerContext();
    const queryClient = useQueryClient();
    const { reset, register, handleSubmit, formState: { errors } } = useForm<EditCommentFormFields>({
        defaultValues: { text: text },
        resolver: zodResolver(editCommentFormSchema)
    });
    const { mutateAsync, isSuccess, isError, error, isPending } = useMutation({
        mutationKey: ["editComment", username, id],
        mutationFn: (data: EditCommentFields) => editComment(data),
        onSuccess: (_, variables) => {
            queryClient.setQueryData<InfiniteData<FetchCommentsFromPostReturn>>([
                "fetchComments", postId],
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            comments: page.comments.map((comment) =>
                                comment.id === id
                                    ? { ...comment, text: variables.text }
                                    : comment
                            ),
                        })),
                    };
                });
            reset({ text: variables.text })
            setIsEditing(false)

        }
    });

    useEffect(() => {
        reset({ text: text })
    }, [text, reset])
    const onSubmit: SubmitHandler<EditCommentFormFields> = async ({ text }: EditCommentFormFields) => {
        const data: EditCommentFields = {
            clerkId: user?.id ?? "",
            commentId: id,
            text: text
        };
        await mutateAsync(data);

    }
    return (
        <div className='flex items-center justify-start gap-2 text-brand-text text-sm'>
            {!isEditing && <div>{text}</div>}
            {isEditing && <div className='w-full flex flex-col gap-2'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-2'>
                    <div className='w-full flex flex-col gap-2'>
                        <MessageArea className='max-w-full h-40 resize-none border border-brand-border text-brand-text 
                    bg-transparent text-left px-2 py-1'
                            placeholder='Comment Something' {...register("text")} />
                        {errors.text && <Message content={errors.text.message} disableOnContent='never' variant='error' />}
                    </div>
                    <div className='w-full flex justify-end gap-1'>
                        <Button className=' bg-brand-white  hover:cursor-pointer
                        hover:scale-99 transition-all duration-150 text-black' size={"lg"}
                            onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button className='w-20 h-10 border border-brand-border  hover:cursor-pointer
                        hover:scale-99 transition-all duration-150 text-brand-white' type='submit' size={"lg"}>Submit</Button>
                    </div>
                </form>

            </div>}
        </div>
    )
}

export default CommentText