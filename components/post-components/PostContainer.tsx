"use client";
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/card'
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import Link from 'next/link';
import PostInteractiveButton from './PostInteractiveButton';
import { PostContainerProps } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FaHeart } from "react-icons/fa";
import { likePost, toggleBookmark } from '@/actions/postActions';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const PostContainer = ({
    id = "", title = "", content = "", username = "", isLiked = false, isBookMarked = false,
    border = true, hover = true, interactable = true, showCommentButton = true
}: PostContainerProps) => {
    const { user } = useUser();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: likeActionMutate } = useMutation({
        mutationKey: ["likePost", id],
        mutationFn: likePost,
        onMutate: async () => {
            // Cancel outgoing refetches for both feed queries and single post query
            await queryClient.cancelQueries({ queryKey: ["posts-fetching"] });
            await queryClient.cancelQueries({ queryKey: ["getPostForDetails", id] });


            const previousFeedData = queryClient.getQueriesData({ queryKey: ["posts-fetching"] });
            const previousDetailData = queryClient.getQueryData(["getPostForDetails", id]);


            queryClient.setQueriesData({ queryKey: ["posts-fetching"] }, (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        posts: page.posts.map((post: any) => {
                            if (post.id === id) {
                                const nextLiked = !post.isLiked;
                                return {
                                    ...post,
                                    isLiked: nextLiked,
                                    likesCount: nextLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1),
                                };
                            }
                            return post;
                        }),
                    })),
                };
            });


            queryClient.setQueryData(["getPostForDetails", id], (oldData: any) => {
                if (!oldData) return oldData;
                const nextLiked = !oldData.isLiked;
                return {
                    ...oldData,
                    isLiked: nextLiked,
                    likesCount: nextLiked ? (oldData.likesCount || 0) + 1 : Math.max(0, (oldData.likesCount || 0) - 1),
                };
            });

            return { previousFeedData, previousDetailData };
        },
        onError: (err, variables, context) => {

            if (context?.previousFeedData) {
                context.previousFeedData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }

            if (context?.previousDetailData) {
                queryClient.setQueryData(["getPostForDetails", id], context.previousDetailData);
            }
        },
        onSettled: () => {
            // Invalidate both feed queries and single post query to synchronize server state
            queryClient.invalidateQueries({ queryKey: ["posts-fetching"] });
            queryClient.invalidateQueries({ queryKey: ["getPostForDetails", id] });
        }
    });

    const { mutate: bookmarkActionMutate } = useMutation({
        mutationKey: ["bookmark", id],
        mutationFn: toggleBookmark,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["posts-fetching"] });
            await queryClient.cancelQueries({ queryKey: ["getPostForDetails", id] });

            const previousFeedData = queryClient.getQueriesData({ queryKey: ["posts-fetching"] });
            const previousDetailData = queryClient.getQueryData(["getPostForDetails", id]);

            // 1. Optimistically update feed queries
            queryClient.setQueriesData({ queryKey: ["posts-fetching"] }, (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        posts: page.posts.map((post: any) => {
                            if (post.id === id) {
                                return {
                                    ...post,
                                    isBookMarked: !post.isBookMarked,
                                };
                            }
                            return post;
                        }),
                    })),
                };
            });


            queryClient.setQueryData(["getPostForDetails", id], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    isBookMarked: !oldData.isBookMarked,
                };
            });

            return { previousFeedData, previousDetailData };
        },
        onError: (err, variables, context) => {
            if (context?.previousFeedData) {
                context.previousFeedData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            if (context?.previousDetailData) {
                queryClient.setQueryData(["getPostForDetails", id], context.previousDetailData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts-fetching"] });
            queryClient.invalidateQueries({ queryKey: ["getPostForDetails", id] });
        }
    });
    const onCardClicked = () => {
        router.push(`/posts/${id}`);
    }
    const onLikeBtnClicked = () => {
        likeActionMutate({
            clerkId: user?.id ?? "",
            postId: id
        });
    }
    const onBookmarkBtnClicked = () => {
        bookmarkActionMutate({
            clerkId: user?.id ?? "",
            postId: id
        })
    }
    return (
        <div className={`w-4xl rounded-2xl ${border ? "border border-brand-border" : "border-none"} 
        ${hover ? "hover:cursor-pointer hover:bg-brand-dark-hover transition-all duration-150" : ""} 
       `}
            onClick={interactable ? onCardClicked : undefined}>

            <div className='w-full bg-transparent  
            p-4 flex flex-col gap-4'
            >

                <CardHeader className='gap-0.5'>
                    <CardTitle className='text-2xl font-bold '>
                        {title}
                    </CardTitle>
                    <div className='text-brand-text'>
                        {username}
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className='text-brand-text'>
                        {content}
                    </CardDescription>
                </CardContent>
                <CardFooter className={"border-none flex items-center text-[1.4rem] gap-4"}>
                    <PostInteractiveButton onClick={onLikeBtnClicked}>
                        {!isLiked && <FaRegHeart />}
                        {isLiked && <FaHeart className='text-brand-accent' />}
                    </PostInteractiveButton>
                    <PostInteractiveButton onClick={onBookmarkBtnClicked}>
                        {!isBookMarked && <FaRegBookmark />}
                        {isBookMarked && <FaBookmark className='text-brand-accent' />}
                    </PostInteractiveButton>
                    {showCommentButton && <Link
                        href={`/posts/${id}`}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-brand-dark-hover hover:text-[#8F8F8F] transition-all duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FaRegMessage />
                    </Link>}



                </CardFooter>


            </div>

        </div >
    )
}

export default PostContainer
