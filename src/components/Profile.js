import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toastError, toastSuccess } from '../toast'
import { Link } from 'react-router-dom'

const Profile = () => {
    const {currentUser, editEmail, editPassword, editName} = useAuth()

    const [editing, setEditing] = useState(false)
    const [email, setEmail] = useState(currentUser.email)
    const [displayName, setDisplayName] = useState(currentUser.displayName)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const submitForm = async (e) => {
        e.preventDefault()
        setLoading(true)

        try{
            if(email !== currentUser.email){
                await editEmail(email)
            }
            if(displayName !== currentUser.displayName){
                await editName(displayName)
            }
            if(password !== ''){
                if(password === confirmPassword){
                    await editPassword(password)
                }
                else{
                    const error = {
                        message: 'Las contraseñas no coinciden'
                    }
                    throw error
                }
            }
            toastSuccess('Datos cambiados')
        }
        catch(err){
            const {message} = err
            toastError(message)
        }

        setLoading(false)
    }

    const cancelEdit = () => {
        setEmail(currentUser.email)
        setDisplayName(currentUser.displayName)
        
        setEditing(false)
    }

    return <>
        <h1 className="text-center">{editing ? "Editar perfil" : "Mi perfil"}</h1>
        <div className="row d-flex justify-content-center">
            <div className="col col-md-6">
                <div className="card">
                    <div className="card-body">
                        {
                            editing && <>
                                <form onSubmit={submitForm}>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text material-icons">email</span>
                                        <input type="email" className="form-control" value={email} placeholder="Correo electrónico" required onChange={e => {setEmail(e.target.value)}}/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text material-icons">badge</span>
                                        <input type="text" className="form-control" value={displayName} placeholder="Nombre" onChange={e => {setDisplayName(e.target.value)}}/>
                                    </div>

                                    <div className="input-group mb-3">
                                        <span className="input-group-text material-icons">lock</span>
                                        <input type="password" className="form-control" value={password} placeholder="Nueva contraseña (dejar en blanco para no cambiar)"         onChange={(e) => {setPassword(e.target.value)}}/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text material-icons">lock</span>
                                        <input type="password" className="form-control" value={confirmPassword} placeholder="Confirmar nueva contraseña (dejar en blanco para no cambiar)" onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                                    </div>

                                    <div className="mb-3 d-grid">
                                        <button className="btn btn-success d-flex justify-content-center align-items-center" disabled={loading}>
                                            {
                                                loading ? <>
                                                    <span className="spinner-border" role="status"></span> 
                                                </>
                                                : <>
                                                    <span className="material-icons me-2">save</span>Guardar perfil
                                                </>
                                            }
                                        </button>
                                    </div>
                                    <div className="mb-3 d-grid">
                                        <button type="button" className="btn btn-warning d-flex justify-content-center align-items-center" onClick={cancelEdit}>
                                            <span className="material-icons me-2">close</span>Cancelar
                                        </button>
                                    </div>
                                    <div className="d-grid">
                                        <Link to="/password_reset" className="btn btn-danger d-flex justify-content-center align-items-center">
                                            <span className="material-icons me-2">help</span>¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                </form>
                            </>
                        }
                        {
                            !editing && <>
                                <p>
                                    <b>Email:</b> {currentUser.email}
                                </p>
                                <p>
                                    <b>Nombre:</b> {currentUser.displayName ? currentUser.displayName : "No tienes nombre, edita tu usuario para agregar uno"}
                                </p>
                                <p>
                                    <b>Contraseña:</b> Para cambiar tu contraseña ve a editar perfil
                                </p>
                                <div className="d-grid">
                                    <button className="btn btn-success d-flex justify-content-center align-items-center" onClick={() => {setEditing(true)}}>
                                        <span className="material-icons me-2">edit</span>Editar perfil
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Profile