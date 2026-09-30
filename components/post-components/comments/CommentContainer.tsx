import { Card, CardHeader } from '@/components/ui/card'
import { formatTimeAgo } from '@/lib/formatTime'
import { CommentContainerProps } from '@/lib/types'
import React from 'react'

const CommentContainer = ({ text, username, createdAt }: CommentContainerProps) => {
    return (
        <div className='w-full'>
            <div className='w-full p-4 gap-4 flex flex-col'>
                <div className='flex items-center justify-start gap-2'>
                    <div className='text-[0.9rem] align-bottom'>{username}</div>
                    <div className="w-2 h-2 rounded-2xl bg-brand-border" ></div>
                    <div className="text-brand-text align-top text-[0.825rem]">{createdAt ? formatTimeAgo(createdAt) : ""}</div>
                </div>
                <div className='flex items-center justify-start gap-2 text-brand-text text-sm'>
                    <div>{text}</div>
                </div>
            </div>

        </div>
    )
}

export default CommentContainer