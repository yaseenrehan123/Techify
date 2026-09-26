import { Button } from '@/components/ui/button'
import { SidebarProvider, Sidebar as ShadSidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenuItem } from '@/components/ui/sidebar'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
    return (
        <div className='fixed left-0 top-14  h-[calc(100vh-3.5rem)]'>
            <SidebarProvider className='h-full '>
                <ShadSidebar className='top-auto bottom-0 h-[calc(100vh-3.5rem)] border-r-2 border-brand-border ' >
                    <SidebarContent className=' h-full '>
                        <SidebarGroup className='text-brand-white bg-none font-bold text-[1.3rem] text-center
                        gap-5'>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <Link href={"/explore"}>Explore</Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <Link href={"/popular"}>Popular</Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <Link href={"/saved"}>Saved</Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <Link href={"/history"}>History</Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <Link href={"/faq"}>FAQ</Link>
                            </SidebarMenuItem>
                        </SidebarGroup>
                    </SidebarContent>
                </ShadSidebar>
            </SidebarProvider>
        </div>
    )
}

export default Sidebar