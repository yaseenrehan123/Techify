import CommentContainerContextProvider from '@/contexts/CommentContainerContext'
import { formatTimeAgo } from '@/lib/formatTime'
import { CommentContainerProps } from '@/lib/types'
import React from 'react'
import CommentHeader from './CommentHeader'
import CommentText from './CommentText'
import CommentInteractableIcons from './CommentInteractableIcons'

const CommentContainer = (data: CommentContainerProps) => {
    return (
        <div className='w-full'>
            <CommentContainerContextProvider commentData={{
                id: data.id,
                postId: data.postId,
                username: data.username,
                createdAt: formatTimeAgo(data.createdAt),
                text: data.text,
                isByUser: data.isByUser
            }}>
                <div className='w-full p-4 gap-4 flex flex-col'>
                    <CommentHeader />
                    <CommentText />
                    <CommentInteractableIcons />
                </div>
            </CommentContainerContextProvider>


        </div>
    )
}

export default CommentContainer