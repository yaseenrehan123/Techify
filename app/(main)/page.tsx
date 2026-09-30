import PostContainer from '@/components/post-components/PostContainer'
import PostInfiniteScroll from '@/components/post-components/PostInfiniteScroll'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <div className='flex items-center flex-col'>
            <Suspense fallback={<div className="text-yellow-500">Loading posts...</div>}>
                <PostInfiniteScroll />
            </Suspense>


        </div>
    )
}

export default page