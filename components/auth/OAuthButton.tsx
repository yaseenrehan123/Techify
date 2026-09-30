"use client";

import { OAuthButtonProps } from "@/lib/types";
import { useSignIn } from "@clerk/nextjs";
import { useCallback } from "react";
//import Button from "@/components/ui/general/button"; 
import { Button } from "../ui/button";

const OAuthButton = ({ title = "", strategy }: OAuthButtonProps) => {
    const { signIn, fetchStatus } = useSignIn();
    const isReady = fetchStatus === "idle" && signIn
    const isLoading: boolean = fetchStatus === "fetching";
    const onPress = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isReady) return;



        try {
            console.log("OAUTH BUTTON PRESSED!");

            // Trigger the native browser redirection for OAuth providers
            await signIn.sso({
                strategy: strategy,
                redirectUrl: "/auth/sso-callback",
                redirectCallbackUrl: "/auth/sso-callback",
            });

        } catch (err: any) {
            console.error("OAuth web flow error:", err?.message || err);
        }
    }, [signIn, isReady, strategy]);

    return (
        <Button
            onClick={onPress}
            disabled={!isReady}
            type="button"
            className={`w-52 h-14 bg-black rounded-lg flex items-center justify-center border-2
             border-neutral-800 hover:border-neutral-700 transition
             ${isLoading ? "text-yellow-500" : "text-white"}`}
        >
            <span className="text-white font-medium">{isLoading ? "Loading..." : `${title}`}</span>
        </Button>
    );
};

export default OAuthButton;