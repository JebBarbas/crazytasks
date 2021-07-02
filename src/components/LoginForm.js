import React, {useState} from 'react'
import { Redirect } from 'react-router'
import { toastError } from '../toast'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

import googleSVG from './google.svg'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')

    const [showingLogin, setShowingLogin] = useState(true)
    const [loading, setLoading] = useState(false)

    const {
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        currentUser,
        loginWithGoogle,
    } = useAuth()

    const submitForm = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(showingLogin){
            try{
                await loginWithEmailAndPassword(email, password)
            }
            catch(err){
                showError(err)
            }
        }
        else{
            try{
                if(password === confirmedPassword){
                    await registerWithEmailAndPassword(email, password)
                }
                else{
                    const err = {
                        code: 'auth/bad-password',
                        message: 'The passwords do not match'
                    }
                    throw err
                }
            }
            catch(err){
                showError(err)
            }
        }
        setLoading(false)
    }

    const loginWith = (conQue) => {
        try{
            if(conQue === 'google'){
                loginWithGoogle()
            }
        }
        catch(err){
            const {message} = err
            toastError(message)
        }
    }

    const showError = error => {
        const {message} = error
        toastError(message)
    }

    return <>
        <h1 className="text-center">{showingLogin ? "Iniciar sesión" : "Registrarte"}</h1>
    {
        currentUser && <>
            <Redirect to="/"></Redirect>
        </>
    }
    {
        !currentUser && <>
            <div className="row d-flex justify-content-center">
                <div className="col col-md-6">
                    <div className="card bg-dark">
                        <div className="card-body">
                            {currentUser && currentUser.email}
                            <form onSubmit={submitForm}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text material-icons">email</span>
                                    <input type="email" className="form-control" value={email} placeholder="Correo electronico" required onChange={e => {setEmail(e.target.value)}}/>
                                </div>

                                <div className="input-group mb-3">
                                    <span className="input-group-text material-icons">lock</span>
                                    <input type="password" className="form-control" value={password} placeholder="Contraseña" required onChange={e => {setPassword(e.target.value)}}/>
                                </div>

                                {
                                    !showingLogin &&
                                        <div className="input-group mb-3">
                                        <span className="input-group-text material-icons">lock</span>
                                        <input type="password" className="form-control" value={confirmedPassword} placeholder="Confirma contraseña" required onChange={e => {setConfirmedPassword(e.target.value)}}/>
                                        </div>
                                }
                                {
                                    showingLogin &&
                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn btn-primary d-flex justify-content-center" disabled={loading}>
                                                {
                                                    loading ? <>
                                                        <span className="spinner-border" role="status"></span> 
                                                    </>
                                                    : <>
                                                        <span className="material-icons me-2">login</span>Iniciar sesión
                                                    </>
                                                }
                                            </button>
                                        </div>
                                }
                                {
                                    !showingLogin &&
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-secondary d-flex justify-content-center" disabled={loading}>
                                            {
                                                loading ? <>
                                                    <span className="spinner-border" role="status"></span> 
                                                </>
                                                : <>
                                                    <span className="material-icons me-2">person_add</span>Registrarte
                                                </>
                                            }
                                        </button>
                                    </div>
                                }
                                <div className="d-grid mt-3 mb-3">
                                    <button type="button" className="btn btn-light d-flex justify-content-center align-items-center" onClick={() => {loginWith('google')}}>
                                        <img src={googleSVG} style={{height: '24px'}} className="me-2" alt="Google Sign In" />
                                        Iniciar sesión con Google
                                    </button>
                                </div>
                                {
                                    showingLogin && <>
                                        <div className="d-grid">
                                            <Link to="/password_reset" className="btn btn-danger d-flex justify-content-center align-items-center">
                                                <span className="material-icons me-2">help</span>¿Olvidaste tu contraseña?
                                            </Link>
                                        </div>
                                        <span>
                                            ¿No tienes una cuenta? <button className="btn btn-link" onClick={e => setShowingLogin(false)}>Registrate</button>
                                        </span>
                                    </>
                                }
                                {
                                    !showingLogin &&
                                    <span>
                                        ¿Ya tienes una cuenta? <button className="btn btn-link" onClick={e => setShowingLogin(true)}>Inicia sesión</button>
                                    </span>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
    
    </>
}

export default LoginForm