"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const AddCommentForm = () => {
    const [enabled, setEnabled] = useState<boolean>(false)

    return (
        <div className='w-full flex items-center px-4 rounded-4xl text-brand-text
                border-2 border-brand-border border-solid'>
            <div className='w-full flex items-center flex-col gap-2 '>
                <Input className='w-full rounded-4xl border-none '
                    placeholder='Join The Conversation'
                    onFocus={() => setEnabled(true)} />
                {enabled && <div className='w-full flex items-center justify-end gap-2'>
                    <Button variant={"default"} size={"lg"}
                        onClick={() => setEnabled(false)}
                        className={`border border-brand-border text-brand-white hover:cursor-pointer hover:bg-brand-dark-hover
                                transition-all duration-150 `}>
                        Cancel
                    </Button>
                    <Button variant={"default"} size={"lg"}
                        className={`bg-brand-accent text-brand-white hover:cursor-pointer hover:bg-[#2A9875]
                                transition-all duration-150 `}>
                        Submit
                    </Button>
                </div>}
            </div>

        </div>

    )
}

export default AddCommentForm