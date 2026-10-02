import React from 'react'
import { Menubar as ShadMenubar } from './ui/menubar'
import { FaRegBell } from "react-icons/fa";
import ProfileAvatar from './auth/ProfileAvatar';
import Searchbar from './search/Searchbar';
const Menubar = () => {
    return (
        <div className='fixed top-0 left-0 w-full z-10 text-brand-white'>
            <ShadMenubar className={`w-full h-auto border-b-2 border-brand-border min-h-14 grid grid-cols-[1fr_2fr_1fr] items-center
                 py-1 flex-none gap-6 bg-brand-dark-overlay`}>
                <div className='flex gap-2  px-4'>
                    <div className='text-4xl font-bold text-brand-accent'>Techify</div>
                </div>
                <Searchbar />
                <div className='flex justify-end items-center px-4 text-brand-white gap-7 text-[1.4rem]'>
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

