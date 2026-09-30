"use client";
import { fetchCommentsFromPost } from '@/actions/postActions';
import CommentContainer from './CommentContainer';
//import { FetchCommentsFromPostReturn } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React, { useEffect } from 'react'
import Message from '@/components/ui/custom/message';
import { useUser } from '@clerk/nextjs';
//import CommentActiveMenuContextProvider from '@/context/CommentActiveMenuContext';
import { usePostDetailsnContext } from '@/contexts/PostDetailsContext';

const DisplayComments = () => {
    const LIMIT: number = 12
    const { id: postId } = usePostDetailsnContext();
    const { user } = useUser()

    const { ref, inView } = useInView({
        threshold: 0.1
    })

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status,
        error
    } = useInfiniteQuery({
        queryKey: ["fetchComments", postId],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => fetchCommentsFromPost({
            page: pageParam,
            limit: LIMIT,
            postId: postId,
            userId: user?.id ?? ""
        }),
        getNextPageParam: (lastPage, allPages) => lastPage.nextPage ?? null,
        enabled: !!postId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }

    }, [inView])

    if (status == "pending") {
        return <Message variant='loading' content={"Loading Comments..."} disableOnContent='never' />
    }
    if (status == "error") {
        return <Message variant='error' content={error.message} disableOnContent='never' />
    }

    return (
        <div className='flex items-center flex-col w-full gap-3'>
            {data.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                    {page.comments.map((comment, i) => (
                        <CommentContainer
                            key={comment.id}
                            id={comment.id}
                            username={comment.username}
                            text={comment.text}
                            createdAt={comment.createdAt}
                        //isByUser={comment.isByUser}
                        //postId={comment.postId}
                        />
                    ))}
                </React.Fragment>
            ))}


            <div ref={ref}></div>
        </div>

    )
}

export default DisplayComments