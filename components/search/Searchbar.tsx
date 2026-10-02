"use client";
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Searchbar = () => {
    const [search, setSearch] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setSearch(searchParams.get("query") || "");
    }, [searchParams]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const params = new URLSearchParams(searchParams.toString());
            if (search.trim()) {
                params.set("query", search.trim());
            } else {
                params.delete("query");
            }
            router.push(`?${params.toString()}`);
        }
    };
    return (
        <div className='w-full flex items-center justify-center '>
            <Input className='w-full rounded-[40px] border border-brand-border text-center outline-1'
                placeholder='Search Something'
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown} />
        </div>
    )
}

export default Searchbar