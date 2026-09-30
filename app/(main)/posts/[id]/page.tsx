import React, { Suspense } from 'react'
import PostDetailsSection from '@/components/post-components/details/PostDetailsSection'

const page = () => {

    return (
        <div className='flex items-center flex-col gap-3'>
            <Suspense fallback={<div className="text-yellow-500">Loading Post Details...</div>}>
                <PostDetailsSection />
            </Suspense>

        </div>
    )
}

export default page