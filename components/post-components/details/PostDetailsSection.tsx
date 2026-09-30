'use client';
import React, { useEffect } from 'react'
import PostContainer from '../PostContainer';
import { Separator } from '@base-ui/react';
import AddCommentForm from '../comments/AddCommentForm';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToViewedPosts, getPostById } from '@/actions/postActions';
import { useUser } from '@clerk/nextjs';
import Message from '@/components/ui/custom/message';
import PostDetailsContextProvider from '@/contexts/PostDetailsContext';
import DisplayComments from '../comments/DisplayComments';


const PostDetailsSection = () => {
    const params = useParams();
    const id = params.id as string;
    const { user, isLoaded } = useUser();
    const queryClient = useQueryClient();
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["getPostForDetails", id],
        queryFn: () => getPostById({
            currentUserId: user?.id ?? "",
            postId: id,
        }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        enabled: !!id && isLoaded
    });
    const { mutate } = useMutation({
        mutationKey: ["viewedPost", id],
        mutationFn: addToViewedPosts,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts-fetching"] });
        }
    });

    //console.log("Post Details Data: ", data);
    useEffect(() => {
        if (!data?.id || !user?.id) return
        mutate({ clerkId: user?.id, postId: data.id })
    }, [data?.id, user?.id, mutate])
    if (isPending || !isLoaded) {
        return <Message content="Loading..." variant="loading" disableOnContent="never" />;
    }
    if (isError) {
        return <Message content={error.message} variant="error" disableOnContent="never" />;
    }
    if (!data) {
        return <Message content="Post not found." variant="error" disableOnContent="never" />;
    }
    return (
        <div className='flex items-center flex-col gap-3'>
            <PostDetailsContextProvider postData={{
                id: data.id ?? ""
            }}>
                <PostContainer
                    id={data.id ?? ""}
                    title={data.title}
                    content={data.text}
                    username={data.username}
                    isLiked={data.isLiked}
                    isBookMarked={data.isBookMarked}
                    border={false} hover={false} interactable={false} showCommentButton={false} />
                <div className='w-full flex items-center flex-col gap-8'>
                    <Separator orientation={"horizontal"}
                        className={"bg-brand-border w-4/5 h-2 rounded-2xl"} />
                    <AddCommentForm />
                    <DisplayComments />
                </div>
            </PostDetailsContextProvider>


        </div >
    )
}

export default PostDetailsSection