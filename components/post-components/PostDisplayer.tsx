"use client";
import React from 'react'
import PostContainer from './PostContainer';
import { PostsDisplayerProps } from '@/lib/types'

const PostDisplayer = ({ data }: PostsDisplayerProps) => {
    return (
        <div className='w-full min-h-10 flex flex-col items-center gap-2'>
            {data.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                    {page.posts.map((post) => (
                        <PostContainer
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            content={post.text}
                            isLiked={post.isLiked}
                            likesCount={post.likesCount}
                            username={post.username}
                            isBookMarked={post.isBookMarked}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    )
}

export default PostDisplayer