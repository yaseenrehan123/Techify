import { deleteComment } from '@/actions/postActions';
import { useCommentContainerContext } from '@/contexts/CommentContainerContext';
import { CommentMenuButtonFloatingProps, FetchCommentsFromPostReturn } from '@/lib/types'
import { useUser } from '@clerk/nextjs';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const CommentMenuButtonFloating = ({ isMenuOpen, isByUser, ...props }: CommentMenuButtonFloatingProps) => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const { setIsEditing, id, postId } = useCommentContainerContext();
    const { mutate: handleDelete } = useMutation({
        mutationKey: ["deleteComment", id],
        mutationFn: deleteComment,
        onMutate: async () => {
            const queryKey = ["fetchComments", postId];

            // 1. Cancel ongoing fetches so they don't overwrite optimistic update
            await queryClient.cancelQueries({ queryKey });

            // 2. Snapshot previous cache value for rollback on error
            const previousComments = queryClient.getQueryData<InfiniteData<FetchCommentsFromPostReturn>>(queryKey);

            // 3. Optimistically filter out deleted comment
            queryClient.setQueryData<InfiniteData<FetchCommentsFromPostReturn>>(queryKey, (oldData) => {
                if (!oldData || !oldData.pages) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        comments: page.comments.filter((comment) => comment.id !== id),
                    })),
                };
            });

            return { previousComments };
        },
        onError: (_err, _variables, context) => {
            // Roll back to previous cache state if server action fails
            if (context?.previousComments) {
                queryClient.setQueryData(["fetchComments", postId], context.previousComments);
            }
        },
    });

    if (!isMenuOpen) return <div></div>
    return (
        <div className={`absolute  flex flex-col items-center w-50 h-30 bg-brand-dark-overlay text-white
                    z-10 rounded-2xl gap-2`} {...props} >
            <div className='flex w-full flex-col items-center gap-2'>
                <div className='transition-all duration-150 w-full
                            hover:bg-brand-dark-hover flex items-center justify-center hover:cursor-pointer'>Save</div>


            </div>
            {isByUser && <div className='flex w-full flex-col items-center gap-2' >
                <div className='transition-all duration-150 w-full
                            hover:bg-brand-dark-hover flex items-center justify-center hover:cursor-pointer'
                    onClick={() => setIsEditing(true)}>
                    Edit
                </div>
                <div className='transition-all duration-150 w-full
                            hover:bg-brand-dark-hover flex items-center justify-center hover:cursor-pointer'
                    onClick={() => deleteComment({ clerkId: user?.id ?? "", commentId: id })}>
                    Delete
                </div>
            </div>
            }
        </div>
    )
}

export default CommentMenuButtonFloating