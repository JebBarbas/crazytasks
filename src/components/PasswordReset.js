import React, {useState} from 'react'
import { toastError, toastSuccess } from '../toast'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

const PasswordReset = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const {resetPassword} = useAuth()

    const submitForm = async (e) => {
        e.preventDefault()
        setLoading(true)

        try{
            await resetPassword(email)
            toastSuccess('Verifica tu correo para seguir el proceso')
        }
        catch(err){
            const {message} = err
            toastError(message)
        }

        setLoading(false)
    }

    return <>
        <h1 className="text-center">Recuperar contraseña</h1>
        <div className="row d-flex justify-content-center">
            <div className="col col-md-6">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={submitForm}>
                            <div className="input-group mb-3">
                                <span className="input-group-text material-icons">email</span>
                                <input type="email" className="form-control" value={email} placeholder="Correo electronico" required onChange={e => {setEmail(e.target.value)}}/>
                            </div>

                            <div className="d-grid mb-3">
                                <button type="submit" className="btn btn-primary d-flex justify-content-center" disabled={loading}>
                                    {
                                        loading ? <>
                                            <span className="spinner-border" role="status"></span> 
                                        </>
                                        : <>
                                            <span className="material-icons me-2">send</span>Enviar correo de recuperación
                                        </>
                                    }
                                </button>
                            </div>
                            <span>
                                ¿Ya recuperaste tu contraseña? <Link to="/login" className="btn btn-link">Inicia sesión</Link>
                            </span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default PasswordReset