import React from 'react'
import { useCommentActiveMenuContext } from '@/contexts/CommentActiveMenuContext';
import { useCommentContainerContext } from '@/contexts/CommentContainerContext';
import { HiDotsHorizontal } from "react-icons/hi";
import { flip, offset, shift, useFloating, useDismiss, useInteractions } from "@floating-ui/react";
import CommentMenuButtonFloating from './CommentMenuButtonFloating';
import CommentMenuButtonIcon from './CommentMenuButtonIcon';
const CommentMenuButton = () => {
    const { isByUser, id: commentId } = useCommentContainerContext()
    const { activeCommentId, setActiveCommentId } = useCommentActiveMenuContext();
    const isMenuOpen = activeCommentId == commentId
    const { x, y, strategy, refs, context } = useFloating({
        open: isMenuOpen,
        onOpenChange(isOpen) {
            setActiveCommentId(isOpen ? commentId : "")
        },
        placement: "bottom-start",
        middleware: [
            offset({
                mainAxis: -4,
                crossAxis: 20
            }),
            flip({ fallbackPlacements: ["top-start"] }),
            shift({ padding: 8 })
        ]
    });
    const dismiss = useDismiss(context, {

    });
    const { getFloatingProps, getReferenceProps } = useInteractions([
        dismiss
    ]);

    return (
        <div>
            <CommentMenuButtonIcon onClick={() => setActiveCommentId(commentId)} ref={refs.setReference} {...getReferenceProps()} />
            <CommentMenuButtonFloating isMenuOpen={isMenuOpen} isByUser={isByUser} ref={refs.setFloating} {...getFloatingProps()}
                style={{ position: strategy, top: y, left: x }} />

        </div>
    )
}

export default CommentMenuButton