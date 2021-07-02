import React from 'react'
import { Route, Redirect } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

const AuthRoute = ({component: Component, ...rest}) => {
    const {currentUser} = useAuth()

    return <>
        <Route 
            {...rest} 
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to="/login" />
            }}
        />
    </>
}

export default AuthRoute