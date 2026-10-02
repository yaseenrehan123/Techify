import { CommentContainerContextFields, CommentContainerContextProviderProps } from "@/lib/types";
import { createContext, useContext, useState } from "react";

const CommentContainerContext = createContext<CommentContainerContextFields>({
    id: "",
    postId: "",
    username: "",
    createdAt: "",
    text: "",
    isByUser: false,
    isEditing: false,
    setIsEditing: () => { }
});


const CommentContainerContextProvider = ({ children, commentData }: CommentContainerContextProviderProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        <CommentContainerContext.Provider value={{
            isEditing: isEditing,
            setIsEditing: setIsEditing,
            ...commentData
        }}>
            {children}
        </CommentContainerContext.Provider>
    )
}

export default CommentContainerContextProvider

export function useCommentContainerContext(): CommentContainerContextFields {
    const context = useContext(CommentContainerContext);
    if (!context) throw new Error("Comment Container Context Null!");
    return context
}