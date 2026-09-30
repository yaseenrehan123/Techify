//import PageContainer from '@/features/general/PageContainer'
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import React from 'react'

const page = () => {
    return (
        <div>
            <div id="clerk-captcha" />
            <AuthenticateWithRedirectCallback
                signInForceRedirectUrl={"/"}
                signUpForceRedirectUrl={"/"} />
        </div>
    )
}

export default page