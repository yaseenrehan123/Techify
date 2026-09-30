import React from "react";
import z from "zod";
import createUserSchema from "../schemas/createUserSchema";
import signUpSchema from "../schemas/signUpSchema";
import loginSchema from "../schemas/loginSchema";
import verificationSchema from "@/schemas/verificationSchema";
import deleteAccountConfirmationSchema from "@/schemas/deleteAccountConfirmationSchema";
import createCommentSchema from "@/schemas/createCommentSchema";
import createPostSchema from "@/schemas/createPostSchema";
import editCommentSchema from "@/schemas/editCommentSchema";
import { fetchCommentsFromPost, fetchPosts, getPostById } from "@/actions/postActions";
import { InfiniteData } from "@tanstack/react-query";
import createPostFormSchema from "@/schemas/createPostFormSchema";
import createCommentFormSchema from "@/schemas/createCommentFormSchema";

//COMPONENTS
export type PostContainerProps = {
    id: string,
    title?: string,
    username?: string,
    content?: string,
    isLiked?: boolean,
    likesCount?: number,
    isBookMarked?: boolean,
    border?: boolean,
    hover?: boolean,
    interactable?: boolean,
    showCommentButton?: boolean
}
export type OAuthButtonProps = {
    title: string
    strategy: OAuthStrategy
}
export type PostInteractiveButtonProps = {
    children: React.ReactNode
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}
export type CommentContainerProps = {
    id: string,
    username: string,
    text: string,
    createdAt: Date
}
//SHADCN COMPONENTS
export type AlignmentProps = React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'rowLeft' | 'rowCenter' | 'rowRight' | 'colLeft' | 'colCenter' | 'colRight',
    gap?: 'sm' | 'md' | 'lg'
};
export type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'success' | 'loading' | 'error',
    disableOnContent?: 'never' | 'sm' | 'md' | 'lg',
    content?: String
}
export type PostsDisplayerProps = {
    data: InfiniteData<FetchPostsReturn>
}
export type MessageAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant?: "default" | "sm" | "md" | "lg",
    theme?: "light" | "dark"
}
//HELPER TYPES
export type AuthFloatingPanelMode = "signup" | "login" | "verify" | undefined
export type ComponentActiveState = {
    enabled: boolean,
    setEnabled: (val: boolean) => void
}
export type OAuthStrategy =
    | 'oauth_github'
    | 'oauth_google'
    | 'oauth_apple'
    | 'oauth_discord'
export type FeedType = "latest" | "popular" | "explore" | "bookmarked" | "viewed"
export type PostUserActionFields = {
    clerkId: string,
    postId: string
}
//CONTEXTS 
export type ProfileFloatingContextFields = ComponentActiveState;
export type DeleteAccountConfirmationContextFields = ComponentActiveState
export type CreatePostOverlayContextFields = ComponentActiveState;
export type AuthFloatingModalContextFields = {
    mode: AuthFloatingPanelMode
    setMode: (val: AuthFloatingPanelMode) => void,
}
export type PostDetailsContextFields = {
    id: string,
}
//CONTEXT PROVIDERS
export type PostDetailsContextProviderProps = {
    children: React.ReactNode,
    postData: PostDetailsContextFields
}
//SCHEMA INFERS
export type CreateUserFields = z.infer<typeof createUserSchema>
export type SignupFields = z.infer<typeof signUpSchema>
export type LoginFields = z.infer<typeof loginSchema>
export type DeleteAccountConfirmationFields = z.infer<typeof deleteAccountConfirmationSchema>
export type VerificationFields = z.infer<typeof verificationSchema>
export type CreateCommentFields = z.infer<typeof createCommentSchema>
export type CreatePostFields = z.infer<typeof createPostSchema>
export type EditCommentFields = z.infer<typeof editCommentSchema>
export type CreatePostFormFields = z.infer<typeof createPostFormSchema>
export type CreateCommentFormFields = z.infer<typeof createCommentFormSchema>
//ACTION PROPS
export type FetchCommentsFromPostFields = {
    page: number,
    limit: number,
    postId: string,
    userId: string
}
export type LikePostFields = {
    clerkId: string,
    postId: string
}
export type FetchPostFields = {
    page: number,
    limit: number,
    filters?: {
        clerkId?: string,
        postId?: string,
        feed: FeedType
    },
    currentUserId: string
}
export type GetPostByIdFields = {
    currentUserId?: string,
    postId: string
}
export type BookmarkPostFields = {
    clerkId: string,
    postId: string
}
//RETURN FUNCTION TYPE
export type PostWithRelations = Awaited<ReturnType<typeof getPostById>>
export type FetchPostsReturn = Awaited<ReturnType<typeof fetchPosts>>
//export type FetchCommentsFromPostReturn = Awaited<ReturnType<typeof fetchCommentsFromPost>>