import React, {useContext, useState, useEffect} from 'react'
import { auth, googleProvider } from '../firebase'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children, placeholder}) => {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    

    const registerWithEmailAndPassword = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    const loginWithEmailAndPassword = (email, password) => {
        return auth.signInWithEmailAndPassword(email,password)
    }

    const logout = () => {
        return auth.signOut()
    }

    const loginWithGoogle = () => {
        return auth.signInWithPopup(googleProvider)
    }

    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email)
    }

    const editEmail = (email) => {
        return currentUser.updateEmail(email)
    }

    const editPassword = (password) => {
        return currentUser.updatePassword(password)
    }

    const editName = (name) => {
        return currentUser.updateProfile({displayName: name})
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setLoading(false)
            setCurrentUser(user)
        })
        return unsubscribe
    }, [])
    
    const value = {
        currentUser,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        logout,
        loginWithGoogle,
        resetPassword,
        editEmail,
        editPassword,
        editName,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
            {loading && <>
                <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                    <div className="spinner-border me-2" role="status"></div>{placeholder}
                </div>
            </>}
        </AuthContext.Provider>
    )
}