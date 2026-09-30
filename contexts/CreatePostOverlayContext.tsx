import { CreatePostOverlayContextFields } from "@/lib/types";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";

const CreatePostOverlayContext = createContext<CreatePostOverlayContextFields>({
    enabled: false,
    setEnabled: () => { }
});


const CreatePostOverlayContextProvider = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const enabled = searchParams.get("create-post") == "true";
    const setEnabled = useCallback((val: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set("create-post", "true");
        } else {
            params.delete("create-post");
        }

        const queryString = params.toString();
        const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(targetUrl);
    }, [searchParams, pathname, router])
    return (
        <CreatePostOverlayContext.Provider value={{ enabled, setEnabled }}>
            {children}
        </CreatePostOverlayContext.Provider>
    )
}

export default CreatePostOverlayContextProvider

export function useCreatePostOverlayContext(): CreatePostOverlayContextFields {
    const context = useContext(CreatePostOverlayContext);
    if (!context) throw new Error("Profile Floating Panel Context Null!");
    return context
}