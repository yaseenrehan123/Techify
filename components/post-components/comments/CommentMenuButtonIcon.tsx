import { CommentMenuButtonIconProps } from '@/lib/types'
import React from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'

const CommentMenuButtonIcon = ({ ...props }: CommentMenuButtonIconProps) => {
    return (
        <div className='text-brand-text hover:cursor-pointer hover:scale-99 transition-all duration-150'
            {...props}>
            <HiDotsHorizontal />
        </div>
    )
}

export default CommentMenuButtonIcon