"use client";
import { Button } from '@/components/ui/button'
import { SidebarProvider, Sidebar as ShadSidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenuItem } from '@/components/ui/sidebar'
import { useCreatePostOverlayContext } from '@/contexts/CreatePostOverlayContext';
import { FeedType } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const Sidebar = () => {
    const { setEnabled } = useCreatePostOverlayContext();
    const { user } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const handleFeedChange = (feed: FeedType) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("feed", feed);
        params.delete("authorId");
        router.push(`/?${params.toString()}`);
    };
    const handlePostsBySelf = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("feed");
        params.set("authorId", user?.id ?? "");
        router.push(`/?${params.toString()}`);
    }
    return (
        <div className='fixed left-0 top-14  h-[calc(100vh-3.5rem)]'>
            <SidebarProvider className='h-full '>
                <ShadSidebar className='top-auto bottom-0 h-[calc(100vh-3.5rem)] border-r-2 border-brand-border ' >
                    <SidebarContent className=' h-full '>
                        <SidebarGroup className='text-brand-white bg-none font-bold text-[1.3rem] text-center
                        gap-5'>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <div onClick={() => handleFeedChange("explore")}>Explore</div>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <div onClick={() => handleFeedChange("popular")}>Popular</div>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <div onClick={() => handleFeedChange("bookmarked")}>Saved</div>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <div onClick={() => handleFeedChange("viewed")}>History</div>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <div onClick={handlePostsBySelf}>My Posts</div>
                            </SidebarMenuItem>
                            <SidebarMenuItem className='hover:cursor-pointer hover:text-[#535353] transition-all duration-150 text-center
                            '>

                                <Link href={"/faq"}>FAQ</Link>
                            </SidebarMenuItem>

                        </SidebarGroup>
                        <SidebarGroup>
                            <Button className={`bg-brand-accent text-brand-white font-bold text-[1.4rem] h-10 hover:cursor-pointer
                                hover:bg-[#2A9875] hover:scale-99 transition-all duration-150`}
                                onClick={() => setEnabled(true)}>
                                Post
                            </Button>
                        </SidebarGroup>
                    </SidebarContent>
                </ShadSidebar>
            </SidebarProvider>
        </div>
    )
}

export default Sidebar