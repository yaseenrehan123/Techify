import PostContainer from '@/components/post-components/PostContainer'
import { Input } from '@/components/ui/input'
import { Separator } from '@base-ui/react'
import { Button } from '@/components/ui/button'
import React from 'react'
import AddCommentForm from '@/components/post-components/comments/AddCommentForm'
import CommentContainer from '@/components/post-components/comments/CommentContainer'

const page = () => {
    return (
        <div className='flex items-center flex-col gap-3'>
            <PostContainer border={false} hover={false} interactable={false} showCommentButton={false} />
            <div className='w-full flex items-center flex-col gap-8'>
                <Separator orientation={"horizontal"}
                    className={"bg-brand-border w-4/5 h-2 rounded-2xl"} />
                <AddCommentForm />
                <CommentContainer />
            </div>

        </div>
    )
}

export default page