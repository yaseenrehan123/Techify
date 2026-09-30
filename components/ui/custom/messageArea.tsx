import { MessageAreaProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'

const MessageArea = ({ variant, theme, children, className, ...props }: MessageAreaProps) => {
    return (
        <textarea {...props} className={cn(variants({ variant, theme }), className)}>
            {children}
        </textarea>
    )

}

export default MessageArea

const variants = cva(`text-center rounded-[8px] h-8 focus:outline-2 outline-neutral-400 w-full h-full min-h-10 
    `, {
    variants: {
        variant: {
            default: 'max-w-xs max-h-16',
            sm: 'max-w-sm max-h-10',
            md: "max-w-md max-h-30",
            lg: 'max-w-lg max-h-50'
        },
        theme: {
            light: 'bg-white text-black',
            dark: 'bg-gray-950 text-white'
        }
    },
    defaultVariants: {
        variant: 'default',
        theme: 'light'
    }
})