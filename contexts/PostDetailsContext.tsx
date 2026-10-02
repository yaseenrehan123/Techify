import { PostDetailsContextFields, PostDetailsContextProviderProps } from "@/lib/types";
import { createContext, useContext } from "react";

const PostDetailsContext = createContext<PostDetailsContextFields>({
    id: ""
});


const PostDetailsContextProvider = ({ children, postData }: PostDetailsContextProviderProps) => {


    return (
        <PostDetailsContext.Provider value={{ ...postData }}>
            {children}
        </PostDetailsContext.Provider>
    )
}

export default PostDetailsContextProvider

export function usePostDetailsContext(): PostDetailsContextFields {
    const context = useContext(PostDetailsContext);
    if (!context) throw new Error("Profile Floating Panel Context Null!");
    return context
}