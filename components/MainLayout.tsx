import Sidebar from "@/features/sidebar/Sidebar"
import React from 'react'
import Menubar from "./Menubar"
import AuthFloatingModal from "./auth/auth-form/AuthFloatingModal"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full h-full bg-brand-background relative'>
            <Menubar />
            <AuthFloatingModal />
            <div className="w-full h-full grid grid-cols-[1fr_3fr_1fr] pt-16">
                <div><Sidebar /></div>
                <div className='w-full h-full'>
                    {children}
                </div>
                <div></div>
            </div>

        </div>
    )
}

export default MainLayout