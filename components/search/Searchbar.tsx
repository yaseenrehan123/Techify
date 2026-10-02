"use client";
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FaSearch } from "react-icons/fa";

const Searchbar = () => {
    const [search, setSearch] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setSearch(searchParams.get("query") || "");
    }, [searchParams]);

    const pushParams = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) {
            params.set("query", search.trim());
        } else {
            params.delete("query");
        }
        const queryString = params.toString();
        router.push(queryString ? `/?${queryString}` : '/');
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            pushParams();
        }
    };

    return (
        <div className='w-full flex items-center justify-center border border-brand-border rounded-[40px] h-10 px-1'>
            <Input className='w-[90%] rounded-[40px] border-none text-center outline-1'
                placeholder='Search Something'
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown} />
            <div className="w-[10%] h-full flex items-center justify-center border-l border-brand-border 
            hover:cursor-pointer hover:scale-99 transition-all duration-150"
                onClick={pushParams}>
                <FaSearch />
            </div>
        </div>
    )
}

export default Searchbar