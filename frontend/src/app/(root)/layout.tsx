import React from 'react'
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { cookies } from 'next/headers';

interface ProtectedLayoutProps {
    children: React.ReactNode
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = async ({ children }) => {
    // these line are meant to be uncommented when the authentication is implemented
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('Auth_token')?.value;
    if (!authToken) {
        redirect('/login')
    }
    return (
        <Navigation>
            {children}
        </Navigation>
    )
}

export default ProtectedLayout