import Sidebar from "@/features/sidebar/Sidebar"
import React, { Suspense } from 'react'
import Menubar from "./Menubar"
import AuthFloatingModal from "./auth/auth-form/AuthFloatingModal"
import CreatePostOverlay from "./post-components/create/CreatePostOverlay"
import DeleteAccountConfirmation from "./auth/delete-account/DeleteAccountConfirmation"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full h-full bg-brand-background relative '>
            <Suspense>
                <Menubar />
                <AuthFloatingModal />
                <DeleteAccountConfirmation />
                <CreatePostOverlay />
                <div className="w-full h-full grid grid-cols-[1fr_3fr_1fr] pt-16">
                    <div><Sidebar /></div>
                    <div className='w-full h-full'>
                        {children}
                    </div>
                    <div></div>
                </div>
            </Suspense>


        </div>
    )
}

export default MainLayout