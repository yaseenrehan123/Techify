"use client";
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/card'
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import Link from 'next/link';
import PostInteractiveButton from './PostInteractiveButton';
import { PostContainerProps } from '@/lib/types';
import { useRouter } from 'next/navigation';
const PostContainer = ({
    title = "", content = "", username = "", border = true, hover = true, interactable = true, showCommentButton = true
}: PostContainerProps) => {
    const router = useRouter();
    const onCardClick = () => {
        router.push("/posts/id");
    }
    return (
        <div className={`w-4xl rounded-2xl ${border ? "border border-brand-border" : "border-none"} 
        ${hover ? "hover:cursor-pointer hover:bg-brand-dark-hover transition-all duration-150" : ""} 
       `}
            onClick={interactable ? onCardClick : undefined}>

            <div className='w-full bg-transparent  
            p-4 flex flex-col gap-4'
            >

                <CardHeader className='gap-0.5'>
                    <CardTitle className='text-2xl font-bold '>
                        This is the title for the card
                    </CardTitle>
                    <div className='text-brand-text'>
                        MagstarDev
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className='text-brand-text'>
                        {`This is a practice text about game. Techify is a website where you can discuss all sorts of tech stuff, Watch tech videos, projects etc. This is my first hackathon, I hope I will be able to complete this project, For me that would be a win, I am not sure how well it will be received, Probably not well, But I am hoping to make it to deadline at the very least. Please cheer for me,
I already think it isnt turning out that great but I will try to get something done.I only have 7 days to finish it, And with school and all I only get 3 hous per day to work on it.Thankyou! `}
                    </CardDescription>
                </CardContent>
                <CardFooter className={"border-none flex items-center text-[1.4rem] gap-4"}>
                    <PostInteractiveButton>
                        <FaRegHeart />
                    </PostInteractiveButton>
                    <PostInteractiveButton>
                        <FaRegBookmark />
                    </PostInteractiveButton>
                    {showCommentButton && <Link
                        href="/posts/aa"
                        className="flex items-center justify-center p-2 rounded-full hover:bg-brand-dark-hover hover:text-[#8F8F8F] transition-all duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FaRegMessage />
                    </Link>}



                </CardFooter>


            </div>

        </div >
    )
}

export default PostContainer
