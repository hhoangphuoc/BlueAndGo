import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Settings() {
    const {
        currentUser,
        changeEmail,
        changePassword,
        errorMessage,
        errorCode,
    } = useAuth()
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [editedEmail, setEditedEmail] = useState('')
    const [editedPassword, setEditedPassword] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [displayEmail, setDisplayEmail] = useState(currentUser.email)

    async function handleSetEmail() {
        let res
        setLoading(true)
        await changeEmail(editedEmail, password).then((data) => {
            res = data
        })
        setLoading(false)
        if (res == 'success') {
            setIsEditingEmail(false)
            // setDisplayEmail(editedEmail)
        }
    }

    async function handleSetPassword() {
        setLoading(true)
        await changePassword(editedPassword, password)
        setLoading(false)
        if (!errorMessage) {
            setIsEditingPassword(false)
        }
    }

    return (
        <div className="flex flex-auto flex-col h-screen">
            {/* Text Header */}
            <div className="px-4 pt-4 w-full justify-end">
                <h2 className="text-4xl font-light"> Settings </h2>
                <hr className="mb-0 mt-3" />
            </div>
            {/* Page content */}
            <div className="flex flex-col h-full">
                {/* Email and password settings */}
                <div className="mt-4 text-xl relative">
                    {/* Display email and edit email button */}
                    <div className="flex flex-row items-center border p-4 shadow-md">
                        {/* Display email and input */}
                        <i className="fa-solid fa-envelope select-none mr-2 mt-0.5"></i>
                        {/* <span className="select-none mr-1 font-medium">Email:</span> */}
                        {!isEditingEmail ? (
                            displayEmail
                        ) : (
                            <div className="flex flex-col gap-2">
                                <input
                                    className="outline-none border px-2 py-1"
                                    value={editedEmail}
                                    onChange={(e) =>
                                        setEditedEmail(e.target.value)
                                    }
                                    placeholder="New Email Address"
                                    type="text"
                                ></input>
                                <input
                                    className="outline-none border px-2 py-1"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Current password"
                                    type="password"
                                ></input>
                            </div>
                        )}
                        {/* Edit or cancel button */}
                        {!isEditingEmail ? (
                            <i
                                onClick={() => {
                                    setIsEditingEmail(true)
                                    if (isEditingPassword) {
                                        setIsEditingPassword(false)
                                    }
                                }}
                                className="fa-solid fa-pen-to-square mx-3 cursor-pointer hover:scale-110 hover:opacity-70 duration-150 text-blue-500 text-xl"
                            ></i>
                        ) : (
                            <>
                                <i
                                    onClick={() => setIsEditingEmail(false)}
                                    className="fa-solid fa-xmark mx-3 cursor-pointer hover:scale-110 hover:opacity-70 duration-150 text-red-500 text-xl"
                                ></i>
                                <button
                                    onClick={handleSetEmail}
                                    className="px-4 py-2 -my-1 bg-blue-500 rounded-lg text-white hover:bg-blue-600 font-semibold duration-150 justify-self-end"
                                >
                                    {loading ? (
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                    ) : (
                                        'Confirm'
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                    {/* Display password and edit password button */}
                    <div className="flex flex-row items-center border p-4 shadow-md mt-4">
                        {/* Display password and input */}
                        <i className="fa-solid fa-lock select-none mr-2.5"></i>
                        {/* <span className="select-none mr-1 font-medium">
                        Password:
                    </span> */}
                        {!isEditingPassword ? (
                            '∗'.repeat(currentUser.email.length + 4)
                        ) : (
                            <div className="flex flex-col gap-2">
                                <input
                                    className="outline-none border px-2 py-1"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Old password"
                                    type="password"
                                ></input>
                                <input
                                    className="outline-none border px-2 py-1"
                                    value={editedPassword}
                                    onChange={(e) =>
                                        setEditedPassword(e.target.value)
                                    }
                                    placeholder="New Password"
                                    type="password"
                                    autoComplete="new-password"
                                ></input>
                            </div>
                        )}
                        {/* Edit or cancel button */}
                        {!isEditingPassword ? (
                            <i
                                onClick={() => {
                                    setIsEditingPassword(true)
                                    if (isEditingEmail) {
                                        setIsEditingEmail(false)
                                    }
                                }}
                                className="fa-solid fa-pen-to-square mx-3 cursor-pointer hover:scale-110 hover:opacity-70 duration-150 text-blue-500 text-xl"
                            ></i>
                        ) : (
                            <>
                                <i
                                    onClick={() => setIsEditingPassword(false)}
                                    className="fa-solid fa-xmark mx-3 cursor-pointer hover:scale-110 hover:opacity-70 duration-150 text-red-500 text-xl"
                                ></i>
                                <button
                                    onClick={handleSetPassword}
                                    className="px-4 py-2 -my-1 bg-blue-500 rounded-lg text-white hover:bg-blue-600 font-semibold duration-150 justify-self-end"
                                >
                                    {loading ? (
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                    ) : (
                                        'Confirm'
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {errorCode && (
                    <div className="mt-4 w-full max-w-[30ch] border border-solid border-rose-400 text-rose-400 text-center">
                        {errorMessage}
                    </div>
                )}
                {/* Enter password input and confirm button to save changes */}
                {/* <div className="mb-2 w-full flex flex-row p-4 text-lg items-center">
                    <p className="mr-2">Enter password to save changes:</p>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="outline-none border-2 px-2 mr-4 w-[25ch]"
                        placeholder="Password"
                        type="password"
                        autocomplete="new-password"
                    ></input>
                    <button className="px-4 py-1 bg-blue-500 rounded-lg text-white hover:bg-blue-600 font-semibold duration-150 justify-self-end">
                        Save Changes
                    </button>
                </div> */}
            </div>
        </div>
    )
}

export default Settings
