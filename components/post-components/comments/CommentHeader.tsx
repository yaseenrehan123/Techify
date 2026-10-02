"use client";
import { useCommentContainerContext } from '@/contexts/CommentContainerContext'
import React from 'react'

const CommentHeader = () => {
    const { username, createdAt } = useCommentContainerContext();
    return (
        <div className='flex items-center justify-start gap-2'>
            <div className='text-[0.9rem] align-bottom'>{username}</div>
            <div className="w-2 h-2 rounded-2xl bg-brand-border" ></div>
            <div className="text-brand-text align-top text-[0.825rem]">{createdAt}</div>
        </div>
    )
}

export default CommentHeader