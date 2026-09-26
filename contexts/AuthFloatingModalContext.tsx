"use client";
import { AuthFloatingPanelMode, ProfileFloatingContextFields, AuthFloatingModalContextFields } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";

const AuthFloatingModalContext = createContext<AuthFloatingModalContextFields>({
    //enabled: false,
    //setEnabled: () => { },
    mode: "signup",
    setMode: () => { },
    //closeModal: () => { }
});


const SignupFloatingContextProvider = ({ children }: { children: React.ReactNode }) => {
    //const [enabled, setEnabled] = useState<boolean>(false);
    //const [mode, setMode] = useState<AuthFloatingPanelMode>("signup");
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const rawMode = searchParams.get("authmode");
    const mode: AuthFloatingPanelMode =
        rawMode === "signup" || rawMode === "login" || rawMode === "verify"
            ? rawMode
            : undefined;

    const setMode = (newMode: AuthFloatingPanelMode) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newMode) {
            params.set("authmode", newMode);
        } else {
            params.delete("authmode");
        }
        const queryString = params.toString();
        const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(targetUrl);
    }

    return (
        <AuthFloatingModalContext.Provider value={{ mode, setMode }}>
            {children}
        </AuthFloatingModalContext.Provider>
    )
}

export default SignupFloatingContextProvider

export function useAuthFloatingModalContext(): AuthFloatingModalContextFields {
    const context = useContext(AuthFloatingModalContext);
    if (!context) throw new Error("Signup Floating Panel Context Null!");
    return context
}