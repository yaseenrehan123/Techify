import { cn } from '@/lib/utils'
import type { MessageProps } from '@/lib/types'
import { cva } from 'class-variance-authority'
import React, { useEffect, useState } from 'react'

const Message = ({ variant, children, content, disableOnContent = 'never', className, ...props }: MessageProps) => {
    const [display, setDisplay] = useState<string>("");

    const getDisableDuration = (): number => {
        let dur: number = 0;
        switch (disableOnContent) {
            case 'sm':
                dur = 1000
                break;
            case 'md':
                dur = 2000
                break;
            case 'lg':
                dur = 2500
                break;
            default:
                dur = 0
                break;
        }
        return dur;
    };

    useEffect(() => {
        if (!content) return;
        setDisplay(content);
        if (disableOnContent !== "never") {
            const timer = setTimeout(() => setDisplay(""), getDisableDuration());
            return () => clearTimeout(timer);
        }

    }, [content]);

    return (
        <div className={cn(variants({ variant }), className)} {...props}>
            {display}
        </div>
    )
}

const variants = cva('text-left font-roboto', {
    variants: {
        variant: {
            default: 'text-white',
            success: 'text-green-500',
            loading: 'text-yellow-500',
            error: 'text-red-500'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
})

export default Message