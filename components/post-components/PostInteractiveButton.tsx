import { PostInteractiveButtonProps } from '@/lib/types';
import React from 'react'

const PostInteractiveButton = ({ children, onClick }: PostInteractiveButtonProps) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (onClick) { onClick(e) };
    }
    return (
        <button type='button' onClick={(e) => handleClick(e)}
            className='hover:cursor-pointer hover:text-[#8F8F8F] transition-all duration-150'>
            {children}
        </button>
    )
}

export default PostInteractiveButton