import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AccountMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const { currentUser, logout } = useAuth()

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        const onClickOutside = (e) => {
            if (
                !(e.target.id == 'wrapper') &&
                !(e.target.parentElement.id == 'wrapper')
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('click', onClickOutside)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)
            document.removeEventListener('click', onClickOutside)
        }
    }, [])

    return (
        <>
            <div className="relative">
                <button
                    type="button"
                    id="wrapper"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <i className="fa-solid fa-user mx-auto object-cover rounded-full hover:scale-110 hover:opacity-60 duration-150 cursor-pointer p-4 -m-4 -mr-16 text-lg" />
                </button>
                {isOpen && (
                    <div
                        id="wrapper"
                        className="absolute z-60 right-0 py-2 w-48 mt-2 border bg-white text-slate-900 rounded-lg shadow-xl text-base font-normal -mr-10 "
                    >
                        <h2 className="block py-2 px-4 select-none font-semibold break-words border-b-2 border-gray-300">
                            {currentUser.email}
                        </h2>
                        <div
                            id="wrapper"
                            onClick={() => {
                                logout()
                                setIsOpen(false)
                            }}
                            className="flex flex-row items-center py-2 px-4 duration-150 hover:bg-blue-500 hover:text-white select-none cursor-pointer border-b-2 border-gray-100"
                        >
                            <i className="fa-solid fa-right-from-bracket block pr-2"></i>
                            <h2 className="block">Logout</h2>
                        </div>
                        <Link
                            id="wrapper"
                            href="/settings"
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            className="flex flex-row items-center py-2 px-4 duration-150 hover:bg-blue-500 hover:text-white select-none cursor-pointer"
                        >
                            <i className="fa-solid fa-gear block pr-2"></i>
                            <h2 className="block">Settings</h2>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
