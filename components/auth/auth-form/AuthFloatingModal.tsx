"use client";
import { useAuthFloatingModalContext } from '@/contexts/AuthFloatingModalContext'
import React from 'react';
import SignupForm from './SignupForm';
import VerificationForm from './VerificationForm';
import LoginForm from './LoginForm';

const SignupContainer = () => {
    const { mode } = useAuthFloatingModalContext();

    if (!mode) return <div></div>
    return (
        <div className='w-full h-full fixed bg-brand-background/80 z-20 flex items-center justify-center'>
            <div className='border-[1.5px] border-brand-border rounded-lg w-xl min-h-150 p-6
            flex flex-col gap-4 bg-[#0B0B0B]'>
                {mode == "signup" && <SignupForm />}
                {mode == "login" && <LoginForm />}
                {mode == "verify" && <VerificationForm />}
            </div>
        </div>
    )
}

export default SignupContainer