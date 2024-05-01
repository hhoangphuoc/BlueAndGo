import React, { useEffect } from 'react'
import Router from 'next/router'
import Link from 'next/link'

const Sidebar = (props) => {
    const { children, logout } = props

    return (
        <div className="flex">
            <div className="flex flex-col sm:flex-row sm:justify-around">
                <div className="h-screen w-56 bg-white shadow-lg sticky top-0">
                    <div className="flex items-center justify-start mx-6 mt-10">
                        <Link href="/">
                            <span className="text-blue-500 dark:text-blue-500 ml-4 text-2xl font-bold">
                                BLUE & GO!
                            </span>
                        </Link>
                    </div>
                    <nav className="mt-10 px-6 h-4/6">
                        <Link
                            className="hover:text-gray-100 hover:bg-blue-500 flex items-center p-2 my-6 transition-color text-gray-800 rounded-lg duration-150 "
                            href="/"
                        >
                            <i className="fa-solid fa-house"></i>
                            <span className="mx-4 text-lg font-normal">
                                Dashboard
                            </span>
                            <span className="flex-grow text-right"></span>
                        </Link>
                        <Link
                            className="hover:text-gray-100 hover:bg-blue-500 flex items-center p-2 my-6 transition-color text-gray-800 rounded-lg duration-150"
                            href="/history"
                        >
                            <i className="fa-solid fa-ranking-star"></i>
                            <span className="mx-4 text-lg font-normal">
                                Game History
                            </span>
                            <span className="flex-grow text-right"></span>
                        </Link>
                        <Link
                            className="hover:text-gray-100 hover:bg-blue-500 flex items-center p-2 my-6 transition-color text-gray-800 rounded-lg duration-150"
                            href="/settings"
                        >
                            <i className="fa-solid fa-gear"></i>
                            <span className="mx-4 text-lg font-normal">
                                Settings
                            </span>
                            <span className="flex-grow text-right"></span>
                        </Link>
                    </nav>
                    <div className="mx-5 my-10">
                        <Link
                            onClick={() => logout()}
                            className="hover:text-gray-100 hover:bg-blue-500 flex items-center p-2 my-6 transition-color text-gray-800 rounded-lg duration-150"
                            href="/login"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span className="mx-4 text-lg font-normal">
                                Logout
                            </span>
                            <span className="flex-grow text-right"></span>
                        </Link>
                    </div>
                </div>
            </div>
            {/* <main className="w-full">{children}</main> */}
        </div>
    )
}

export default Sidebar
