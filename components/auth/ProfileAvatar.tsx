"use client";
import { useProfileFloatingContext } from '@/contexts/ProfileFloatingContext';
import { useClerk, useUser } from '@clerk/nextjs';
import React from 'react'
import { FaCircleUser } from 'react-icons/fa6';
import { offset, useDismiss, useFloating, useInteractions } from "@floating-ui/react"
import { Button } from '../ui/button';
import { useAuthFloatingModalContext } from '@/contexts/AuthFloatingModalContext';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { AuthFloatingPanelMode } from '@/lib/types';
const ProfileAvatar = () => {
    const { user } = useUser()
    const { signOut } = useClerk()
    const loggedIn: boolean = !!user && !!user?.id;
    const username: string = user?.username || user?.firstName || user?.fullName || user?.emailAddresses[0].emailAddress || ""
    const displayChar: string = username.charAt(0).toUpperCase();
    const { enabled, setEnabled } = useProfileFloatingContext();
    const { setMode } = useAuthFloatingModalContext();
    const { refs, context, x, y, strategy } = useFloating({
        open: enabled,
        onOpenChange(val) { setEnabled(val) },
        placement: "bottom-start",
        middleware: [
            offset({
                mainAxis: -125,
                crossAxis: 35
            })
        ]
    });
    const dismiss = useDismiss(context, {
        outsidePress: true
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

    const onProfileClicked = () => {
        setEnabled(true)
    };
    // const onSignUpClicked = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setAuthFormEnabled(true);
    //     setMode("signup");
    //     setEnabled(false)

    // }
    // const onLoginClicked = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setAuthFormEnabled(true);
    //     setMode("login");
    //     setEnabled(false)

    // }
    // const setAuthMode = (mode: AuthFloatingPanelMode) => {
    //     const params = new URLSearchParams(searchParams.toString() ?? );
    //     params.set("authmode", mode);
    //     router.push(`${pathname}?${params.toString()}`);
    //     setEnabled(false);
    // }
    return (
        <div className='flex justify-end px-4 text-brand-white gap-7 text-[1.4rem] relative'
            ref={refs.setReference}
            {...getReferenceProps()}
            onClick={onProfileClicked}>
            <div className='flex items-center justify-center hover:cursor-pointer'>
                {loggedIn && <div className='bg-brand-background border-brand-dark-hover text-brand-white'>
                    {displayChar}
                </div>}
                {!loggedIn && <div>
                    <FaCircleUser />
                </div>}
            </div>

            {enabled && <div className='absolute w-40 h-10 bg-brand-white  rounded-lg p-1'
                ref={refs.setFloating}
                {...getFloatingProps()}
                style={{ position: strategy, top: x, left: y }}>
                <div >
                    {loggedIn && <div className='flex items-center gap-2'>
                        <Button className={`bg-transparent border-brand-border text-brand-text font-bold hover:cursor-pointer
                    hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={() => signOut()}>
                            SignOut
                        </Button>
                    </div>}
                    {!loggedIn && <div className='flex items-center gap-2'>
                        <Button className={`bg-transparent border-brand-border text-brand-text font-bold hover:cursor-pointer
                    hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={(e) => { e.stopPropagation(); setMode("signup") }}>
                            SignIn
                        </Button>
                        <Button className={`bg-transparent border-brand-border text-brand-text font-bold hover:cursor-pointer
                    hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={(e) => { e.stopPropagation(); setMode("login") }}>
                            Login
                        </Button>
                    </div>}
                </div>

            </div>}
        </div>
    )
}

export default ProfileAvatar