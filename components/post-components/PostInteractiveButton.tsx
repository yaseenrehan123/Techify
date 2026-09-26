import React from 'react'

const PostInteractiveButton = ({ children }: { children: React.ReactNode }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }
    return (
        <button type='button' onClick={(e) => handleClick(e)}
            className='hover:cursor-pointer hover:text-[#8F8F8F] transition-all duration-150'>
            {children}
        </button>
    )
}

export default PostInteractiveButton