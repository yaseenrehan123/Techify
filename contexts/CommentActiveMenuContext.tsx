import { CommentActiveMenuContextFields } from "@/lib/types";
import { createContext, useContext, useState } from "react";

const CommentActiveMenuContext = createContext<CommentActiveMenuContextFields | undefined>(undefined);

const CommentActiveMenuContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeCommentId, setActiveCommentId] = useState<string>("")
    return (
        <CommentActiveMenuContext.Provider value={{ activeCommentId: activeCommentId, setActiveCommentId: setActiveCommentId }}>
            {children}
        </CommentActiveMenuContext.Provider>
    )
}

export default CommentActiveMenuContextProvider

export function useCommentActiveMenuContext(): CommentActiveMenuContextFields {
    const context = useContext(CommentActiveMenuContext);
    if (context == undefined) {
        throw new Error("COMMENT ACTIVE MENU CONTEXT NULL!")
    }
    return context
}