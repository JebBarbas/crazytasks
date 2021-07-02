import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return <>
        <div className="alert alert-danger text-center">
            <h1>Error 404</h1>
            <p className="d-flex align-items-center justify-content-center">
                <span className="material-icons me-2">error_outline</span>
                La pagina que buscas no existe.
            </p>
            <p>
                Regresa al <Link to="/">inicio</Link>.
            </p>
        </div>
    </>
}

export default NotFound