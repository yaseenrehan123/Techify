import PostContainer from '@/components/post-components/PostContainer'
import PostInfiniteScroll from '@/components/post-components/PostInfiniteScroll'
import React from 'react'

const page = () => {
    return (
        <div className='flex items-center flex-col'>
            <PostInfiniteScroll />

        </div>
    )
}

export default page