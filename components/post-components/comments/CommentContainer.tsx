import { Card, CardHeader } from '@/components/ui/card'
import React from 'react'

const CommentContainer = () => {
    return (
        <div className='w-full'>
            <div className='w-full p-4 gap-4 flex flex-col'>
                <div className='flex items-center justify-start gap-2'>
                    <div className='text-[0.9rem] align-bottom'>MagstarDev</div>
                    <div className="w-2 h-2 rounded-2xl bg-brand-border" ></div>
                    <div className="text-brand-text align-top text-[0.825rem]">8 hours</div>
                </div>
                <div className='flex items-center justify-start gap-2 text-brand-text text-sm'>
                    <div>Hi! This is A Comment! Nice Post</div>
                </div>
            </div>

        </div>
    )
}

export default CommentContainer