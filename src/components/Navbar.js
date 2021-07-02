import React from 'react'
import { Link } from 'react-router-dom'
import { toastError } from '../toast'

import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
    const {logout, currentUser} = useAuth()

    const navbarLogout = async () => {
        try {
            await logout()
        }
        catch(err){
            const {message} = err
            toastError(message)
        }
    }

    return <>
        <header className="d-flex justify-content-center align-items-center p-3 bg-dark">
            <Link to="/" className="text-decoration-none text-reset">
                <h3>Crazytasks</h3>
            </Link>
        </header>
        <header className="d-flex justify-content-around align-items-center p-3 bg-dark sticky-top">
            <Link to="/" className="text-decoration-none text-reset">
                <span className="material-icons">home</span>
            </Link>
            {
                currentUser && <>
                    <Link to="/profile" className="text-decoration-none text-reset">
                        <span className="material-icons me-2">person</span>
                    </Link>
                    <span className="material-icons" role="button" onClick={navbarLogout}>logout</span>
                </>
            }
            {
                !currentUser && <>
                    <Link to="/login" className="d-flex text-decoration-none text-reset">
                        <span className="material-icons">login</span>
                    </Link>
                </>
                    
            }
        </header>
    </>
}

export default Navbar