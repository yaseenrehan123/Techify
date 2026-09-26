import { cn } from '@/lib/utils'
import type { AlignmentProps } from '@/lib//types'
import { cva } from 'class-variance-authority'
import React from 'react'

const Alignment = ({ className, variant, gap, children, ...props }: AlignmentProps) => {
    return (
        <div className={cn(variants({ variant, gap }), className)} {...props}>
            {children}
        </div>
    )
}

const variants = cva('flex', {
    variants: {
        variant: {
            rowLeft: 'justify-start',
            rowCenter: 'justify-center',
            rowRight: 'justify-end',
            colLeft: 'flex-col items-start',
            colCenter: 'flex-col items-center',
            colRight: 'flex-col items-end'
        },
        gap: {
            sm: 'gap-1',
            md: 'gap-2',
            lg: 'gap-4'
        }
    },
    defaultVariants: {
        variant: 'colCenter',
        gap: 'sm'
    }
})

export default Alignment