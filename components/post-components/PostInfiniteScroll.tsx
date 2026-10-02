"use client";
import React, { useEffect } from 'react'
import PostContainer from './PostContainer'
import { useUser } from '@clerk/nextjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/actions/postActions';
import Message from '../ui/custom/message';
import { useInView } from "react-intersection-observer"
import PostDisplayer from './PostDisplayer';
import { useSearchParams } from 'next/navigation';
import { FeedType, FetchPostsReturn } from '@/lib/types';
const PostInfiniteScroll = () => {
    const { user, isLoaded } = useUser();
    const postsLimit: number = 9

    const { ref, inView, entry } = useInView({
        threshold: 0.1
    });
    const searchParams = useSearchParams();
    const feedCategory: FeedType = searchParams.get("feed") as FeedType
    const filterUserId: string = searchParams.get("authorId") as string
    const query: string = searchParams.get("query") as string || ""
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
        useInfiniteQuery({
            queryKey: ["posts-fetching", feedCategory, filterUserId, query, user?.id],
            initialPageParam: 1,
            queryFn: async ({ pageParam }: { pageParam: number }) =>
                fetchPosts({
                    page: pageParam,
                    limit: postsLimit,
                    currentUserId: user?.id || "",
                    filters: {
                        clerkId: filterUserId,
                        feed: feedCategory,
                    },
                    query: query
                }),
            getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            enabled: isLoaded,
        });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
    const hasPosts = data?.pages.some((page) => page.posts.length > 0);
    if (status == "pending") return (<Message content={"Loading..."} variant="loading" disableOnContent="never" />)
    if (status == "error") return (<Message content={(error as Error).message} variant="error" disableOnContent="never" />)

    return (
        <div className='flex items-center flex-col gap-4'>
            <PostDisplayer data={data} />
            <div ref={ref}
            >
                <div className={hasNextPage && isFetchingNextPage ? "text-yellow-500" : "text-white"}>
                    {isFetchingNextPage
                        ? "Fetching...."
                        : hasNextPage
                            ? "Scroll down to load..."
                            : hasPosts
                                ? "You have reached the end"
                                : "No posts found"}
                </div>
            </div>
        </div>
    )
}

export default PostInfiniteScroll