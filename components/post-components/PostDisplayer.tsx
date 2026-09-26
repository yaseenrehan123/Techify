import React from 'react'
import PostContainer from './PostContainer'

const PostDisplayer = () => {
    return (
        <div className='flex items-center flex-col gap-4'>
            <PostContainer />
            <PostContainer />
            <PostContainer />
            <PostContainer />
        </div>
    )
}

export default PostDisplayer