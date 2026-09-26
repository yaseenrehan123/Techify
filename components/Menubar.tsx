import React from 'react'
import { MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, Menubar as ShadMenubar } from './ui/menubar'
import { Input } from './ui/input'
import { FaRegBell } from "react-icons/fa";
import ProfileAvatar from './auth/ProfileAvatar';
const Menubar = () => {
    return (
        <div className='fixed top-0 left-0 w-full z-10 text-brand-white'>
            <ShadMenubar className={`w-full h-auto border-b-2 border-brand-border min-h-14 grid grid-cols-[1fr_2fr_1fr] items-center
                 py-1 flex-none gap-6`}>
                <div className='flex gap-2  px-4'>
                    <div className='text-4xl font-bold text-brand-accent'>Techify</div>
                </div>
                <div className='w-full flex items-center justify-center '>
                    <Input className='w-full rounded-[40px] border border-brand-border text-center outline-1'
                        placeholder='Search Something' />
                </div>
                <div className='flex justify-end px-4 text-brand-white gap-7 text-[1.4rem]'>
                    <div className='hover:cursor-pointer '>
                        <FaRegBell />
                    </div>
                    <ProfileAvatar />

                </div>


            </ShadMenubar>
        </div>
    )
}

export default Menubar

