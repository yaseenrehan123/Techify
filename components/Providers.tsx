"use client";
import React from 'react'
import { ClerkProvider } from "@clerk/nextjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProfileFloatingContextProvider from '@/contexts/ProfileFloatingContext';
import SignupFloatingContextProvider from '@/contexts/AuthFloatingModalContext';
import DeleteAccountConfirmationContextProvider from '@/contexts/DeleteAccountConfirmationContext';
import CreatePostOverlayContextProvider from '@/contexts/CreatePostOverlayContext';
const client = new QueryClient();
const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider >
            <QueryClientProvider client={client}>
                <ProfileFloatingContextProvider>
                    <SignupFloatingContextProvider>
                        <DeleteAccountConfirmationContextProvider>
                            <CreatePostOverlayContextProvider>
                                {children}
                            </CreatePostOverlayContextProvider>
                        </DeleteAccountConfirmationContextProvider>
                    </SignupFloatingContextProvider>
                </ProfileFloatingContextProvider>
            </QueryClientProvider>
        </ClerkProvider>
    )
}

export default Providers