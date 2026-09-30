import React from 'react'
import OAuthButton from './OAuthButton'
const OAuthContainer = () => {
    return (
        <div className='flex items-center flex-col gap-2'>
            <OAuthButton title='Sign In With Github' strategy="oauth_github" />
        </div>
    )
}

export default OAuthContainer