"use client";
import { useProfileFloatingContext } from '@/contexts/ProfileFloatingContext';
import { useClerk, useUser } from '@clerk/nextjs';
import React from 'react'
import { FaCircleUser } from 'react-icons/fa6';
import { offset, shift, useDismiss, useFloating, useInteractions } from "@floating-ui/react"
import { Button } from '../ui/button';
import { useAuthFloatingModalContext } from '@/contexts/AuthFloatingModalContext';
import { useDeleteAccountConfirmationContext } from '@/contexts/DeleteAccountConfirmationContext';
const ProfileAvatar = () => {
    const { user } = useUser()
    const { signOut } = useClerk()
    const loggedIn: boolean = !!user && !!user?.id;
    const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? "";

    const displayName =
        user?.username ||
        user?.fullName ||
        user?.firstName ||
        (primaryEmail && !primaryEmail.includes("placeholder") ? primaryEmail.split("@")[0] : "") ||
        "User";

    const displayChar = displayName.charAt(0).toUpperCase();
    const { enabled, setEnabled } = useProfileFloatingContext();
    const { setMode } = useAuthFloatingModalContext();
    const { setEnabled: setDeleteConfirmation } = useDeleteAccountConfirmationContext();

    const { refs, context, x, y, strategy } = useFloating({
        open: enabled,
        onOpenChange(val) { setEnabled(val) },
        placement: "bottom-start",
        middleware: [
            offset(8),
            shift({
                padding: 12
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

            {enabled && <div className='w-max max-w-xs min-w-40 bg-brand-white px-2 rounded-lg p-1'
                ref={refs.setFloating}
                {...getFloatingProps()}
                style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}>
                <div >
                    {loggedIn && <div className='flex items-center gap-2'>
                        <Button className={`bg-transparent border-brand-border text-brand-text font-bold hover:cursor-pointer
                    hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={(e) => { e.stopPropagation(); signOut() }}>
                            SignOut
                        </Button>
                        <Button className={`bg-transparent border-brand-border text-brand-text font-bold hover:cursor-pointer
                    hover:bg-brand-dark-hover transition-all duration-150`}
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmation(true) }}>
                            Delete Account
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