import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SideBar } from '.'
import { useAuth } from '../context/AuthContext'
import AccountMenu from './AccountMenu'

export default function Layout(props) {
    const { children } = props
    const [openSidebar, setOpenSidebar] = useState(true)
    const { currentUser, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!currentUser) {
            router.push('/login')
        } else if (currentUser && router.pathname == '/login') {
            router.push('/')
        }
    })

    return (
        <div className="flex flex-row min-h-screen relative">
            {currentUser && (
                <>
                    {openSidebar && <SideBar logout={logout}></SideBar>}
                    <button
                        className="flex items-center w-12 h-12 pl-5 pt-8 -ml-1 transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue"
                        aria-label="Menu"
                        onClick={() => {
                            setOpenSidebar(!openSidebar)
                        }}
                    >
                        <i className="fa-solid fa-bars hover:scale-110 hover:opacity-60 duration-150 p-4 -m-4 text-xl" />
                    </button>
                    <main className="flex-1 flex flex-col">{children}</main>
                </>
            )}
            {!currentUser && (
                <main className="flex-1 flex flex-col">{children}</main>
            )}
        </div>
    )
}
