import { HTMLAttributes } from "react";
import z from "zod";
import createUserSchema from "../schemas/createUserSchema";
import signUpSchema from "../schemas/signUpSchema";
import loginSchema from "../schemas/loginSchema";
import verificationSchema from "@/schemas/verificationSchema";

//COMPONENTS
export type PostContainerProps = {
    title?: string,
    username?: string,
    content?: string,
    border?: boolean,
    hover?: boolean,
    interactable?: boolean,
    showCommentButton?: boolean
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

//HELPER TYPES
export type AuthFloatingPanelMode = "signup" | "login" | "verify" | undefined

//CONTEXTS 
export type ProfileFloatingContextFields = {
    enabled: boolean,
    setEnabled: (val: boolean) => void
}
export type AuthFloatingModalContextFields = {
    //enabled: boolean,
    // setEnabled: (val: boolean) => void,
    mode: AuthFloatingPanelMode
    setMode: (val: AuthFloatingPanelMode) => void,
    //closeModal: () => void

}

//SCHEMA INFERS
export type CreateUserFields = z.infer<typeof createUserSchema>
export type SignupFields = z.infer<typeof signUpSchema>
export type LoginFields = z.infer<typeof loginSchema>
export type DeleteAccountConfirmationFields = z.infer<typeof loginSchema>
export type VerificationFields = z.infer<typeof verificationSchema>