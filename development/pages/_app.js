import '../styles/globals.css'
import { useState } from 'react'
import { AuthProvider } from '../context/AuthContext'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }) {
    return (
        // React fragment to group list of children without adding node to DOM
        // <>
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>
        // </>
    )
}
