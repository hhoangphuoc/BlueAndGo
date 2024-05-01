/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Router from 'next/router'

export default function login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [isLoggingIn, setIsLoggingIn] = useState(true)
    const [loading, setLoading] = useState(false)

    const { login, signup, errorMessage, errorCode, currentUser } = useAuth()

    useEffect(() => {
        errorHandler()
    })

    function submitHandler() {
        setLoading(true)
        if (!email || !password) {
            setError('Please enter email and password')
            setLoading(false)
        }
        if (isLoggingIn) {
            login(email, password)
        } else {
            signup(email, password)
        }
    }

    function errorHandler() {
        if (errorCode) {
            if (errorCode == 'auth/too-many-requests') {
                setError('Too many attempts, please try again later')
                setLoading(false)
                return
            } else if (errorCode == 'auth/wrong-password') {
                setError('Incorrect email or password, please try again')
                setLoading(false)
                return
            } else if (errorCode == 'auth/invalid-email') {
                setError('Invalid email, please try again')
                setLoading(false)
                return
            } else if (errorCode == 'auth/user-not-found') {
                setError('Incorrect email or password, please try again')
                setLoading(false)
                return
            } else if (errorCode == 'auth/weak-password') {
                setError(
                    'Password should be at least 6 characters, please try again'
                )
                setLoading(false)
                return
            } else if (errorCode == 'auth/invalid-email') {
                setError('Invalid email, please try again')
                setLoading(false)
                return
            } else if (errorCode == 'auth/email-already-in-use') {
                setError(
                    'Email already in use, change your password or make a new account'
                )
                setLoading(false)
                return
            } else {
                setError(errorCode)
                setLoading(false)
                return
            }
        } else {
            setError(null)
            return
        }
    }
    return (
        <div className="flex flex-1 min-h-screen relative bg-gray-100 items-center justify-center">
            <div className="flex flex-col bg-white shadow-lg py-8 px-12 items-center justify-center w-[35ch]">
                <h1 className="text-blue-500 text-4xl font-bold pb-4 select-none">
                    Blue&Go!
                </h1>
                <h1 className="font-semibold text-xl pb-2 select-none">
                    {isLoggingIn ? 'Login' : 'Register'}
                </h1>
                {error && (
                    <div className="w-full max-w-[30ch] border border-solid border-rose-400 text-rose-400 text-center rounded-lg mb-2">
                        {error}
                    </div>
                )}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="Email Address"
                    className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-2"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="outline-none duration-300 border-solid border-2 border-gray-200 p-2 w-full max-w-[30ch] rounded-lg bg-white mb-2"
                />
                <button
                    onClick={submitHandler}
                    type="button"
                    className="bg-blue-500 text-gray-100 rounded-lg w-[26ch] py-1.5 select-none hover:bg-blue-600 duration-300 mb-2"
                >
                    {loading ? (
                        <i className="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                        'Submit'
                    )}
                </button>
                <span className="select-none">
                    {isLoggingIn
                        ? 'Need an account? '
                        : 'Already have an account? '}
                    <span
                        onClick={() => {
                            setIsLoggingIn(!isLoggingIn)
                            setPassword('')
                            setEmail('')
                        }}
                        className="text-blue-500 underline cursor-pointer select-none hover:text-blue-600 duration-300"
                    >
                        {!isLoggingIn ? 'Login' : 'Register'}
                    </span>
                </span>
            </div>
        </div>
    )
}
