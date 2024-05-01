import React, { useContext, useState, useEffect, useRef } from 'react'
import { auth, db } from '../firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorCode, setErrorCode] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const userInfo = useRef()

    function signup(email, password) {
        createUserWithEmailAndPassword(auth, email, password).catch((error) => {
            setErrorCode(error.code)
            setErrorMessage(error.message)
        })
        return
    }

    function login(email, password) {
        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            setErrorCode(error.code)
            setErrorMessage(error.message)
        })
        return
    }

    function logout() {
        return signOut(auth)
    }

    //change email
    async function changeEmail(newEmail, currentPassword) {
        var cred = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        )
        await reauthenticateWithCredential(auth.currentUser, cred)
            .then((data) => {
                console.log('reauthenticated')
            })
            .catch((error) => {
                setErrorCode(error.code)
                setErrorMessage(error.message)
                console.log('problem reauthenticating')
            })
        await updateEmail(auth.currentUser, newEmail)
            .then((data) => {
                console.log('changed email')
            })
            .catch((error) => {
                setErrorCode(error.code)
                setErrorMessage(error.message)
                console.log('problem changing email')
            })
        if (errorCode) {
            return 'error'
        } else {
            return 'success'
        }
    }

    //change password
    async function changePassword(newPassword, currentPassword) {
        var cred = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        )
        await reauthenticateWithCredential(auth.currentUser, cred)
            .then(() => {
                console.log(cred)
            })
            .catch((error) => {
                setErrorCode(error.code)
                setErrorMessage(error.message)
                console.log(errorMessage)
            })
        await updatePassword(auth.currentUser, newPassword)
            .then(() => {
                console.log('changed password')
            })
            .catch((error) => {
                setErrorCode(error.code)
                setErrorMessage(error.message)
                console.log(errorMessage)
            })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        login,
        signup,
        logout,
        changeEmail,
        changePassword,
        userInfo,
        errorCode,
        errorMessage,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
