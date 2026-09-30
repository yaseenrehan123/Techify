"use client";
import { createPost } from '@/actions/postActions';
import { Button } from '@/components/ui/button'
import Alignment from '@/components/ui/custom/alignment';
import Message from '@/components/ui/custom/message';
import MessageArea from '@/components/ui/custom/messageArea'
import { Input } from '@/components/ui/input'
import { useCreatePostOverlayContext } from '@/contexts/CreatePostOverlayContext';
import { CreatePostFields, CreatePostFormFields } from '@/lib/types';
import createPostFormSchema from '@/schemas/createPostFormSchema';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';

const CreatePostOverlay = () => {
    const { user } = useUser();
    const { enabled, setEnabled } = useCreatePostOverlayContext();
    const queryClient = useQueryClient();
    const { register, reset, handleSubmit, formState: { errors } } = useForm<CreatePostFormFields>({
        resolver: zodResolver(createPostFormSchema)
    });
    const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
        mutationKey: ["createPost"],
        mutationFn: createPost,
        onSuccess: () => {
            reset();;
            setEnabled(false);
            queryClient.invalidateQueries({ queryKey: ["posts-fetching"] });
        }
    })
    const userId: string = user?.id || "";
    console.log("User Id: ", userId);
    const onSubmit = async (data: CreatePostFormFields) => {
        const obj: CreatePostFields = {
            userClerkId: userId,
            ...data
        };
        await mutateAsync(obj)

    }
    if (!enabled) return (<div></div>)
    return (
        <div className='w-full h-full fixed bg-brand-background/80 z-20 flex justify-center pt-10'>
            <div className='border-[1.5px] border-brand-border bg-[#0B0B0B] rounded-lg w-xl h-70 min-h-40 
            '>
                {user && <form className='w-full flex flex-col gap-4 p-6'
                    onSubmit={handleSubmit(onSubmit)}>
                    <Alignment variant='colLeft'>
                        <Input className='px-4 text-brand-text bg-transparent border border-brand-border rounded-4xl
                font-semibold text-[1.1rem]!'
                            placeholder='Enter A Title' {...register("title")} />
                        {errors.title && <Message content={errors.title.message} variant='error' disableOnContent='never' />}
                    </Alignment>
                    <Alignment variant='colLeft'>
                        <MessageArea className='bg-transparent border border-brand-border resize-none text-brand-text w-full max-w-full
                text-left px-4 py-1'
                            placeholder='Post Something...' {...register("text")} />
                        {errors.text && <Message content={errors.text.message} variant='error' disableOnContent='never' />}
                    </Alignment>
                    <Alignment variant='rowCenter' className='w-full'>
                        <Message
                            variant={isPending ? "loading" : isSuccess ? "success" : isError ? "error" : "default"}
                            content={isError ? error.message : isPending ? "Loading..." : isSuccess ? "Success!" : ""}
                            disableOnContent={isError ? "never" : "md"} />
                    </Alignment>
                    <div className='w-full flex items-center justify-end gap-2'>
                        <Button variant={"default"} size={"lg"}
                            className={`bg-transparent border border-brand-border text-brand-white hover:cursor-pointer
                                hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={() => setEnabled(false)}>
                            Cancel
                        </Button>
                        <Button variant={"default"} type='submit' size={"lg"}
                            className={`bg-transparent border border-brand-border text-brand-white hover:cursor-pointer
                                hover:bg-brand-dark-hover transition-all duration-150`}>
                            Submit
                        </Button>
                    </div>
                </form>}
                {!user && <Message content={"You must be signed in to post"} variant='error' />}
            </div>
        </div>
    )
}

export default CreatePostOverlay